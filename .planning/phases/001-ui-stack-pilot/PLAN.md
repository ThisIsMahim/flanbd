# Phase 1: UI Stack Analysis & Pilot

## Objective
Identify all occurrences of MUI, Ant Design, and React Bootstrap. Determine the primary library for consolidation and refactor a pilot component to the new standard (Tailwind + Primary Library).

## Context
The codebase currently pulls in `antd`, `@mui/material`, and `react-bootstrap`. This increases JS bundle size and creates inconsistent component APIs. We need to standardize on a single high-level component library alongside Tailwind CSS.

## Research Steps
1. **Usage Audit**: Count imports for each library (`@mui`, `antd`, `react-bootstrap`) to see which is most pervasive.
2. **Feature Mapping**: Identify unique features provided by each (e.g., MUI DataGrid vs AntD Tables) to ensure no functionality is lost.
3. **Pilot Candidate**: Select a component that uses a mix of libraries or a non-standard library (e.g., a Bootstrap component) to refactor.

## Execution Plan
1. **Baseline Audit**: Run a script to find all imports of the three target libraries.
2. **Standard Selection**: Decide on the "Winner" (Core Component Library).
3. **Pilot Refactor**: Convert `src/components/common/Button.jsx` (if exists) or a small UI piece from Bootstrap to Tailwind/MUI.
4. **Documentation**: Create a `.planning/CONVENTIONS.md` update specifying the new standard.

## Verification / UAT
1. **Visual Match**: The pilot component looks identical or better.
2. **Build Success**: The project builds correctly.
3. **Checklist**: All research steps documented in `research/OBSERVATIONS.md`.
