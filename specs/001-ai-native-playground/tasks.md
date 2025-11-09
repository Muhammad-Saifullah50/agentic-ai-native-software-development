# Tasks: AI-Native Scenario Playground Frontend

**Input**: Design documents from `/specs/001-ai-native-playground/`
**Prerequisites**: spec.md (required), plan.md (required), data-model.md, contracts/, quickstart.md

## Format: `[ID] [P?] [Phase] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Phase]**: Corresponds to the implementation phases outlined below.
- Include exact file paths in descriptions where applicable.

## Path Conventions

- Paths shown below assume the `book-source/src/` directory structure for frontend components.

## Phase 1: Setup & Scaffolding

**Purpose**: Initialize the React project and set up the basic structure.

- [X] T001 [Setup] Create `book-source/src/pages/playground.tsx` and set up a basic React component for the playground.
- [X] T002 [Setup] Install additional core dependencies for the playground: `bootstrap`, `react-bootstrap`, `d3` (or `react-flow-renderer`).
- [X] T003 [Setup] Verify TypeScript configuration in `book-source/tsconfig.json` is compatible with new components.
- [X] T004 [Setup] Set up basic project structure within `book-source/src/`: `components`, `services`, `utils`.
- [X] T005 [Setup] Configure Jest and React Testing Library for testing within the Docusaurus project.

---

## Phase 2: Core Components - UI Implementation

**Purpose**: Implement the main static UI components as described in `spec.md`.

- [X] T006 [UI] Implement `ScenarioInputPanel` component in `book-source/src/components/ScenarioInputPanel.tsx`.
- [X] T007 [UI] Implement `SemanticCanvas` component (initial empty canvas) in `book-source/src/components/SemanticCanvas.tsx`.
- [X] T008 [UI] Implement `ReflectionExplanationSidePanel` component (initial empty panel) in `book-source/src/components/ReflectionExplanationSidePanel.tsx`.
- [X] T009 [UI] Implement `GraphEditToolbar` component (static buttons) in `book-source/src/components/GraphEditToolbar.tsx`.
- [X] T010 [UI] Implement `SimulationPanel` component (static controls) in `book-source/src/components/SimulationPanel.tsx`.
- [X] T011 [UI] Implement `ScenarioFeedbackScoring` component (initial empty display) in `book-source/src/components/ScenarioFeedbackScoring.tsx`.
- [X] T012 [UI] Implement `TopBarControls` component in `book-source/src/components/TopBarControls.tsx`.
- [X] T013 [UI] Implement `Footer` component in `book-source/src/components/Footer.tsx`.
- [X] T014 [UI] Assemble all core components into `book-source/src/pages/playground.tsx`.

---

## Phase 3: Integration - Backend Communication

**Purpose**: Connect the frontend to the `002-scenario-backend`.

- [X] T015 [Integration] Implement REST API service for `/simulate` and `/scenarios` in `book-source/src/services/apiService.ts`.
- [X] T016 [Integration] Implement WebSocket service for `/ws/{simulation_id}` in `book-source/src/services/websocketService.ts`.
- [X] T017 [Integration] Integrate `apiService` into `ScenarioInputPanel` for scenario submission.
- [X] T018 [Integration] Integrate `websocketService` to receive simulation events and update application state.

---

## Phase 4: Interactivity & Dynamic Features

**Purpose**: Implement the dynamic behaviors and interactions.

- [X] T019 [Interactivity] Implement dynamic rendering of `Node` and `Edge` data models on `SemanticCanvas`.
- [X] T020 [Interactivity] Implement auto-layout functionality for the `SemanticCanvas`.
- [X] T021 [Interactivity] Implement drag & drop functionality for nodes on `SemanticCanvas`.
- [X] T022 [Interactivity] Implement click functionality to open `ReflectionExplanationSidePanel` with node/edge details.
- [X] T023 [Interactivity] Implement hover functionality to display tooltips on `SemanticCanvas` elements.
- [X] T024 [Interactivity] Implement color-coding by semantic zone on `SemanticCanvas`.
- [X] T025 [Interactivity] Implement `GraphEditToolbar` functionality (Add/Delete Node, Add/Remove Connection, Undo/Redo).
- [X] T026 [Interactivity] Implement `NaturalLanguageEditBox` for workflow modifications.
- [X] T027 [Interactivity] Implement `SimulationPanel` controls (Play, Pause, Step, Reset) to interact with simulation state.

---

## Phase 5: Feedback & Learning Features

**Purpose**: Implement the feedback and learning mechanisms.

- [X] T028 [Feedback] Implement `ReflectionExplanationSidePanel` modes (Explanation, Quiz, Simulation).
- [X] T029 [Feedback] Implement `ScenarioFeedbackScoring` logic and display.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Address non-functional requirements and overall quality.

- [X] T030 [Polish] Implement responsive design for all UI components.
- [X] T031 [Polish] Enhance visual attractiveness (styling, animations, transitions).
- [X] T032 [Polish] Implement robust error handling and display for edge cases (e.g., invalid input, backend unavailability).
- [X] T033 [Polish] Implement basic client-side logging to the browser console for debugging.
- [X] T034 [Tests] Write unit tests for core components and services.
- [X] T035 [Tests] Write integration tests for API and WebSocket interactions.
- [X] T036 [Deployment] Create a `Dockerfile` for the frontend application.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup & Scaffolding (Phase 1)**: No dependencies.
- **Core Components - UI Implementation (Phase 2)**: Depends on Phase 1.
- **Integration - Backend Communication (Phase 3)**: Depends on Phase 1.
- **Interactivity & Dynamic Features (Phase 4)**: Depends on Phase 2 and Phase 3.
- **Feedback & Learning Features (Phase 5)**: Depends on Phase 2 and Phase 3.
- **Polish & Cross-Cutting Concerns (Phase 6)**: Depends on all previous phases.

### Parallel Opportunities

- Tasks within Phase 1 can be parallelized where indicated by `[P]`.
- Tasks within Phase 2 can be parallelized.
- Tasks within Phase 3 can be parallelized.
- Tasks within Phase 4 can be parallelized.
- Tasks within Phase 5 can be parallelized.
- Tasks within Phase 6 can be parallelized where indicated by `[P]`.

---

## Implementation Strategy

### Incremental Delivery

1.  Complete Phase 1: Setup & Scaffolding.
2.  Complete Phase 2: Core Components - UI Implementation.
3.  Complete Phase 3: Integration - Backend Communication.
4.  Complete Phase 4: Interactivity & Dynamic Features.
5.  Complete Phase 5: Feedback & Learning Features.
6.  Complete Phase 6: Polish & Cross-Cutting Concerns.
