# UI Stack Audit Observations

## Dependency Counts
- **Material UI (@mui)**: ~81 files (Mainly icons and Admin tables).
- **Ant Design (antd)**: 1 file (`src/components/Admin/UserMessagesPage.jsx`).
- **React Bootstrap**: <1 file (Minimal to zero component usage, mainly just for icons which can be replaced by `react-icons/bs` or MUI icons).

## Styling Pattern Breakdown
1. **Admin Section**: Heavily reliant on MUI `DataGrid` and utility classes (Tailwind).
2. **Components**: Many components like `UnifiedProductCard.jsx` use a "Style Injection" pattern where CSS is written as a template literal and injected into the document head. This is anti-pattern in a Tailwind project.
3. **Icons**: Fragmented across `heroicons`, `mui/icons`, `react-bootstrap-icons`, and `font-awesome`.

## Consolidation Decision
- **Standard**: Tailwind CSS (Layout/Primitive Styling) + MUI (Complex Components like Tables/Modals).
- **Action**: Deprecate `antd` and `react-bootstrap`. Standardize icons on `react-icons` (which includes all sets) or MUI Icons.

## Pilot Plan
- Refactor `UnifiedProductCard.jsx` to remove the 450+ lines of injected CSS and replace with Tailwind utility classes.
- Prove that the component remains identical (or improved) while being far more "Tailwind-native".
