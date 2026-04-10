# Technical Concerns

## 1. Library Fragmentation
The project uses multiple competing UI libraries:
- Material UI (MUI)
- Ant Design (antd)
- React Bootstrap
- Styled Components
- Tailwind CSS

**Risk**: Significant bundle size bloat and inconsistent UI patterns if not carefully managed.

## 2. Case Sensitivity
Previous issues (documented in logs) highlight build failures on case-sensitive file systems (Vercel/Linux) due to inconsistent file naming (e.g., `home` vs `Home`). Standarization is ongoing.

## 3. Deprecated Patterns
Some libraries like `react-scripts` are older, and the project might eventually benefit from migrating to Vite for faster development cycles.

## 4. Security
Code in `App.js` shows attempts at "anti-inspect" protection (blocking F12, context menus).
**Concern**: These are largely ineffective against determined users and can harm accessibility/UX.

## 5. Performance
Large dependencies (Three.js, GSAP, MUI, AntD) in a single bundle without widespread code splitting could lead to slow initial load times for users on limited bandwidth.
