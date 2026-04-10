# Phase 2: Remove Ant Design Dependency

## Objective
Refactor `UserMessagesPage.jsx` to use Material UI (MUI) components instead of Ant Design (antd). This consolidates the Admin UI stack and reduces the project bundle size.

## Context
`UserMessagesPage.jsx` is the only component identified using `antd`. By migrating it to MUI (which is already globally used), we can deprecate the `antd` dependency.

## Execution Plan
1. **Dependency Mapping**:
   - `antd Table` -> `MUI DataGrid` (matching `OrderTable.jsx`) or `MUI Table`.
   - `antd Modal` -> `MUI Modal` or `MUI Dialog`.
   - `antd Button` -> `MUI Button`.
   - `antd Tag` -> `MUI Chip`.
   - `antd message` -> `notistack enqueueSnackbar`.
2. **Refactor UserMessagesPage.jsx**:
   - Update imports.
   - Map AntD table columns to MUI DataGrid columns.
   - Refactor Modal to Dialog.
   - Replace notifications.
3. **Verification**:
   - Critical path: Viewing messages, deleting messages, and updating status (read/archived).
   - Ensure styling matches the existing Admin aesthetic.

## Verification / UAT
- [x] Table loads and displays user messages correctly. (Migrated to MUI DataGrid)
- [x] Clicking "View" opens the MUI Dialog with message details.
- [x] Delete functionality works (with browser confirm for now).
- [x] Status updates (Mark as Read/Archive) function as expected.
- [x] Build succeeds without AntD imports in this file.
