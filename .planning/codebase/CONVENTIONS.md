# Coding Conventions

## Component Patterns
- **Functional Components**: Universal use of functional components with hooks.
- **File Naming**: PascalCase for JSX components (e.g., `Header.jsx`), camelCase for utility files.
- **Feature Grouping**: Components are grouped into directories by feature/module rather than by type.

## Styling
- **Utility-First**: **Tailwind CSS** is the standard for layout, spacing, and all primitive styling.
- **Component Library**: **Material UI (MUI)** is the standard for complex components (Tables, Modals, Sliders).
- **Icons**: Standardize on `@mui/icons-material` or `react-icons`.
- **Consolidation**: `antd` and `react-bootstrap` are deprecated. Avoid CSS-in-JS style injection patterns.
- **Case Sensitivity**: Explicit focus on standardized casing for imports (Home/Products) to ensure Linux/Vercel compatibility.

## State Management
- **Action Creators**: Standard Redux patterns with thunk for async operations.
- **Global Actions**: Actions like `loadUser` are triggered at the application root (`App.js`).

## API Communication
- **Axios Defaults**: Configured in `App.js` with `withCredentials` and `baseURL`.
- **Error Handling**: Consistently logged to console and often displayed via toast notifications.
