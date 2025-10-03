const crypto = require("crypto");

// In-memory cache store (per-process). Consider Redis for multi-instance.
const cacheStore = new Map();

function buildKey(req) {
  const url = req.originalUrl || req.url;
  const vary = `${req.method}|${url}`;
  return crypto.createHash("sha1").update(vary).digest("hex");
}

function computeETag(payloadBuffer) {
  return `W/"${crypto
    .createHash("sha1")
    .update(payloadBuffer)
    .digest("hex")}"`;
}

// options: { ttlMs, cacheControl }
module.exports = function cacheMiddleware(options = {}) {
  const ttlMs = options.ttlMs ?? 60_000; // default 60s
  const cacheControl = options.cacheControl ?? "public, max-age=60, stale-while-revalidate=120";

  return function (req, res, next) {
    if (req.method !== "GET") return next();

    const key = buildKey(req);
    const now = Date.now();

    const cached = cacheStore.get(key);
    if (cached && cached.expiresAt > now) {
      // Conditional request handling
      const ifNoneMatch = req.headers["if-none-match"]; 
      const ifModifiedSince = req.headers["if-modified-since"]; 

      res.setHeader("ETag", cached.etag);
      res.setHeader("Last-Modified", new Date(cached.lastModified).toUTCString());
      res.setHeader("Cache-Control", cacheControl);

      if (
        (ifNoneMatch && ifNoneMatch === cached.etag) ||
        (ifModifiedSince && new Date(ifModifiedSince).getTime() >= cached.lastModified)
      ) {
        return res.status(304).end();
      }

      res.status(cached.statusCode);
      for (const [hKey, hVal] of Object.entries(cached.headers)) {
        if (!['etag','last-modified','cache-control','content-length'].includes(hKey.toLowerCase())) {
          res.setHeader(hKey, hVal);
        }
      }
      return res.send(cached.body);
    }

    // Wrap res.send to capture body
    const originalSend = res.send.bind(res);
    res.send = (body) => {
      try {
        // Only cache successful JSON-ish responses
        const statusCode = res.statusCode;
        const contentType = res.getHeader("Content-Type") || "";
        const shouldCache = statusCode >= 200 && statusCode < 300 && String(contentType).includes("application/json");

        const payloadBuffer = Buffer.isBuffer(body) ? body : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
        const etag = computeETag(payloadBuffer);
        const lastModified = now;

        res.setHeader("ETag", etag);
        res.setHeader("Last-Modified", new Date(lastModified).toUTCString());
        res.setHeader("Cache-Control", cacheControl);

        if (shouldCache) {
          // Snapshot headers
          const headers = {};
          const headerNames = res.getHeaderNames();
          headerNames.forEach((name) => {
            headers[name] = res.getHeader(name);
          });

          cacheStore.set(key, {
            statusCode,
            headers,
            body: payloadBuffer,
            etag,
            lastModified,
            expiresAt: now + ttlMs,
          });
        }

        return originalSend(body);
      } catch (e) {
        return originalSend(body);
      }
    };

    next();
  };
};


