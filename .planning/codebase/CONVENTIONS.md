# Coding Conventions

## Component Patterns
- **Functional Components**: Universal use of functional components with hooks.
- **File Naming**: PascalCase for JSX components (e.g., `Header.jsx`), camelCase for utility files.
- **Feature Grouping**: Components are grouped into directories by feature/module rather than by type.

## Styling
- **Utility-First**: Strong preference for Tailwind CSS for layout and responsiveness.
- **Component Libraries**: MUI and AntD used for complex UI elements like DataGrids and Modals.
- **Case Sensitivity**: Explicit focus on standardized casing for imports (Home/Products) to ensure Linux/Vercel compatibility.

## State Management
- **Action Creators**: Standard Redux patterns with thunk for async operations.
- **Global Actions**: Actions like `loadUser` are triggered at the application root (`App.js`).

## API Communication
- **Axios Defaults**: Configured in `App.js` with `withCredentials` and `baseURL`.
- **Error Handling**: Consistently logged to console and often displayed via toast notifications.
