# Project: Flan Website Refactor

## Context
A React 18 frontend for "Flan", currently utilizing a fragmented UI stack (MUI, Ant Design, Bootstrap, Styled Components, and Tailwind CSS). The project needs consolidation to improve maintainability, reduce bundle size, and resolve build consistency issues.

## Primary Objectives
1. **Unify UI Stack**: Standardize on Tailwind CSS for layouts and a single component library (likely MUI or AntD based on analysis) for complex widgets.
2. **Performance Optimization**: Reduce bundle size by removing redundant UI libraries.
3. **Consistency**: Ensure path casing is standardized across the codebase to prevent build failures on Linux/Vercel.

## Tech Stack
- **Framework**: React 18
- **State**: Redux
- **Target Styling**: Tailwind CSS + MUI (Preliminary decision)
- **Target Platform**: Vercel

## Success Criteria
- [ ] Single UI component library in use (plus Tailwind).
- [ ] Bundle size reduced via dependency consolidation.
- [ ] Zero build failures due to path casing.
- [ ] Maintain the existing "premium minimalist" aesthetic.
