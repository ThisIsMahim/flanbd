# Project Structure

## Directory Map
- `src/`: Root source directory.
  - `actions/`: Redux action creators.
  - `assets/`: Static files (images, fonts).
  - `Blogs/`: Feature-specific logic for blogging.
  - `components/`: UI Components grouped by feature.
    - `Admin/`: Dashboard, tables, and management tools.
    - `Cart/`: Checkout flow, shipping, and success pages.
    - `Home/`: Homepage specific components.
    - `Layouts/`: Shared components (Header, Footer).
    - `ProductDetails/` / `Products/`: Product listing and singleton views.
    - `User/`: Profile, login, and registration.
    - `common/`: Reusable primitive components.
  - `constants/`: String constants, action types.
  - `hooks/`: Custom React hooks.
  - `pages/`: Page-level wrappers (less utilized than direct components).
  - `reducers/`: Redux reducers for state transitions.
  - `services/`: API service wrappers.
  - `utils/`: Context providers and utility helpers.
  - `App.js`: Main entry point with routing.
  - `index.js`: DOM mounting and Provider setup.
  - `store.js`: Redux store configuration.

## Key Files
- `package.json`: Dependency and script management.
- `tailwind.config.js`: Tailwind CSS styling configuration.
- `vercel.json`: Deployment settings.
