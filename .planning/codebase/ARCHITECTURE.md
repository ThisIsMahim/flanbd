# Architecture Overview

## Design Pattern
The application follows a **Modular Monolith Frontend** pattern using React and Redux.

## Core Layers
1. **View Layer**: React functional components using Hooks. UI is a hybrid of Tailwind utility classes and component libraries (MUI, AntD).
2. **State Layer**: Redux Store acting as the single source of truth for user data, carts, and products.
3. **Service Layer**: Axios-based HTTP requests located in `actions` and `services`.
4. **Logic Layer**: Business logic distributed between Redux actions and component-level hooks.

## Key Mechanisms
- **Routing**: Centralized routing in `App.js` using `react-router-dom`.
- **Authentication**: JWT/Cookie based, managed via `loadUser` action and `ProtectedRoute` component.
- **Admin System**: Nested routing under `/admin` with role-based access control.
- **SEO**: Dynamic title and meta tags managed per-page using `react-helmet-async`.
