import React from "react";
import { Helmet } from "react-helmet-async";

const defaultTitle = "Flan - Fandom Merchandise Store in Bangladesh";
const defaultDescription = "Flan - Leading fandom merchandise store in Bangladesh. Anime keychains, fan merchandise, themed collectibles, and fandom products. Flan Bangladesh - Your trusted vision care provider.";
const defaultKeywords = "Flan, Flan Bangladesh, Flanbd, fandom merchandise Bangladesh, glasses Bangladesh, sunglasses Bangladesh, contact lenses Bangladesh, Flan, anime merchandise";
const defaultImage = "/logo512.png";
const defaultUrl = "https://Flanbd.com";

const MetaData = ({ title, description, keywords, image, url }) => {
  return (
    <Helmet>
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="author" content="Flan" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Flan" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url || defaultUrl} />
      
      {/* Application Meta Tags */}
      <meta name="application-name" content="Flan" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
    </Helmet>
  );
};

export default MetaData;

