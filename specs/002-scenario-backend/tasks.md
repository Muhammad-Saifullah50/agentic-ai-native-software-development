
# Tasks: Core Backend for AI-Native Scenario Simulator



**Input**: Design documents from `/specs/002-scenario-backend/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/



## Format: `[ID] [P?] [Story] Description`



- **[P]**: Can run in parallel (different files, no dependencies)

- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

- Include exact file paths in descriptions



## Path Conventions



- Paths shown below assume the `backend/` directory structure from `plan.md`.



## Phase 1: Setup (Shared Infrastructure)



**Purpose**: Project initialization and basic structure



- [X] T001 Create project structure in `backend/` per implementation plan.

- [X] T002 Initialize poetry project in `backend/`.

- [X] T003 [P] Install dependencies: `fastapi`, `uvicorn`, `sqlalchemy`, `psycopg2-binary`, `alembic`, `openai`, `websockets` in `backend/pyproject.toml`.

- [X] T004 [P] Configure linting and formatting tools (`black`, `ruff`) in `backend/pyproject.toml`.



---



## Phase 2: Foundational (Blocking Prerequisites)



**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented



- [X] T005 Setup database connection and session management in `backend/src/database.py`.

- [X] T006 Configure Alembic for database migrations in `backend/alembic/`.

- [X] T007 Create base Pydantic models for API requests/responses in `backend/src/models/base.py`.

- [X] T008 Setup API routing and middleware structure in `backend/src/main.py`.

- [X] T009 Implement websocket manager in `backend/src/websocket_manager.py`.



**Checkpoint**: Foundation ready - user story implementation can now begin.



---



## Phase 3: User Story 1 - Scenario Simulation (Priority: P1) 🎯 MVP



**Goal**: As a frontend application, I want to submit a user-defined scenario to an API and receive a complete, simulated agent network architecture.



**Independent Test**: Can be tested by sending a POST request with a scenario to the `/simulate` endpoint and validating that the response contains a structured representation of an agent network.



### Implementation for User Story 1



- [X] T010 [US1] Create `Scenario` SQLAlchemy model in `backend/src/models/scenario.py`.

- [X] T011 [US1] Create Alembic migration for `scenarios` table.

- [X] T012 [P] [US1] Create `AgentNetworkArchitecture` Pydantic model in `backend/src/models/api.py`.

- [X] T013 [US1] Implement `ScenarioInterpreterAgent` in `backend/src/sim_agents/scenario_interpreter.py`.

- [X] T014 [US1] Implement `ArchitecturePlannerAgent` in `backend/src/sim_agents/architecture_planner.py`.

- [X] T015 [US1] Implement `ToolSkillMapperAgent` in `backend/src/sim_agents/tool_skill_mapper.py`.

- [X] T016 [US1] Implement `/simulate` endpoint in `backend/src/api/simulate.py`.

- [X] T017 [US1] Implement `/scenarios` endpoint in `backend/src/api/scenarios.py`.



**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.



---



## Phase 4: User Story 2 - Real-time Simulation Streaming (Priority: P2)



**Goal**: As a frontend application, I want to establish a websocket connection to receive real-time events about the simulation's progress.



**Independent Test**: Can be tested by connecting a websocket client, sending a scenario to the API, and verifying that simulation events are received over the websocket.



### Implementation for User Story 2



- [X] T018 [P] [US2] Create `SimulationEvent` Pydantic model in `backend/src/models/api.py`.

- [X] T019 [US2] Implement websocket endpoint `/ws/{simulation_id}` in `backend/src/api/websockets.py`.

- [X] T020 [US2] Implement simulation event streaming logic in the simulation service.



**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.



---



## Phase 5: User Story 3 - Observability and Failure Simulation (Priority: P3)



**Goal**: As a developer or advanced user, I want the simulation to include observability streams and potential failure modes.



**Independent Test**: Can be tested by running a simulation and checking the output stream for events tagged as "observability" or "failure".



### Implementation for User Story 3



- [X] T021 [P] [US3] Create `FailureMode` Pydantic model in `backend/src/models/api.py`.



- [X] T022 [US3] Implement `FailureSimulationAgent` in `backend/src/sim_agents/failure_simulation.py`.

- [X] T023 [US3] Implement `ObservabilityNarrativeAgent` in `backend/src/sim_agents/observability_narrative.py`.

- [X] T024 [US3] Integrate failure mode injection into the simulation service.

- [X] T025 [US3] Integrate observability stream generation into the simulation service.



**Checkpoint**: All user stories should now be independently functional.



---



## Phase 6: Polish & Cross-Cutting Concerns



**Purpose**: Improvements that affect multiple user stories



- [X] T026 [P] Add structured logging to all services and agents.

- [X] T027 [P] Implement comprehensive error handling and validation.

- [ ] T028 Write README for the backend service in `backend/README.md`.

- [ ] T029 Create a `Dockerfile` for the backend service in `backend/Dockerfile`.



---



## Dependencies & Execution Order



### Phase Dependencies



- **Setup (Phase 1)**: No dependencies.

- **Foundational (Phase 2)**: Depends on Setup completion.

- **User Stories (Phase 3-5)**: Depend on Foundational phase completion.

- **Polish (Phase 6)**: Depends on all user stories being complete.



### User Story Dependencies



- **User Story 1 (P1)**: Can start after Foundational (Phase 2).

- **User Story 2 (P2)**: Can start after Foundational (Phase 2).

- **User Story 3 (P3)**: Can start after Foundational (Phase 2).



### Parallel Opportunities



- All Setup tasks marked [P] can run in parallel.

- Once Foundational phase completes, all user stories can start in parallel.

- Models within a story marked [P] can be created in parallel.



---



## Implementation Strategy



### MVP First (User Story 1 Only)



1. Complete Phase 1: Setup

2. Complete Phase 2: Foundational

3. Complete Phase 3: User Story 1

4. **STOP and VALIDATE**: Test User Story 1 independently.



### Incremental Delivery



1. Complete Setup + Foundational.

2. Add User Story 1 → Test independently.

3. Add User Story 2 → Test independently.

4. Add User Story 3 → Test independently.

5. Each story adds value without breaking previous stories."observability" or "failure".



### Implementation for User Story 3



- [X] T021 [P] [US3] Create `FailureMode` Pydantic model in `backend/src/models/api.py`.



- [X] T022 [US3] Implement `FailureSimulationAgent` in `backend/src/sim_agents/failure_simulation.py`.

- [X] T023 [US3] Implement `ObservabilityNarrativeAgent` in `backend/src/sim_agents/observability_narrative.py`.

- [X] T024 [US3] Integrate failure mode injection into the simulation service.

- [X] T025 [US3] Integrate observability stream generation into the simulation service.



**Checkpoint**: All user stories should now be independently functional.



---



## Phase 6: Polish & Cross-Cutting Concerns



**Purpose**: Improvements that affect multiple user stories



- [X] T026 [P] Add structured logging to all services and agents.

- [X] T027 [P] Implement comprehensive error handling and validation.

- [ ] T028 Write README for the backend service in `backend/README.md`.

- [ ] T029 Create a `Dockerfile` for the backend service in `backend/Dockerfile`.



---



## Dependencies & Execution Order



### Phase Dependencies



- **Setup (Phase 1)**: No dependencies.

- **Foundational (Phase 2)**: Depends on Setup completion.

- **User Stories (Phase 3-5)**: Depend on Foundational phase completion.

- **Polish (Phase 6)**: Depends on all user stories being complete.



### User Story Dependencies



- **User Story 1 (P1)**: Can start after Foundational (Phase 2).

- **User Story 2 (P2)**: Can start after Foundational (Phase 2).

- **User Story 3 (P3)**: Can start after Foundational (Phase 2).



### Parallel Opportunities



- All Setup tasks marked [P] can run in parallel.

- Once Foundational phase completes, all user stories can start in parallel.

- Models within a story marked [P] can be created in parallel.



---



## Implementation Strategy



### MVP First (User Story 1 Only)



1. Complete Phase 1: Setup

2. Complete Phase 2: Foundational

3. Complete Phase 3: User Story 1

4. **STOP and VALIDATE**: Test User Story 1 independently.



### Incremental Delivery



1. Complete Setup + Foundational.

2. Add User Story 1 → Test independently.

3. Add User Story 2 → Test independently.

4. Add User Story 3 → Test independently.

5. Each story adds value without breaking previous stories."observability" or "failure".



### Implementation for User Story 3



- [X] T021 [P] [US3] Create `FailureMode` Pydantic model in `backend/src/models/api.py`.



- [X] T022 [US3] Implement `FailureSimulationAgent` in `backend/src/sim_agents/failure_simulation.py`.

- [X] T023 [US3] Implement `ObservabilityNarrativeAgent` in `backend/src/sim_agents/observability_narrative.py`.

- [X] T024 [US3] Integrate failure mode injection into the simulation service.

- [X] T025 [US3] Integrate observability stream generation into the simulation service.



**Checkpoint**: All user stories should now be independently functional.



---



## Phase 6: Polish & Cross-Cutting Concerns



**Purpose**: Improvements that affect multiple user stories



- [X] T026 [P] Add structured logging to all services and agents.

- [X] T027 [P] Implement comprehensive error handling and validation.

- [ ] T028 Write README for the backend service in `backend/README.md`.

- [ ] T029 Create a `Dockerfile` for the backend service in `backend/Dockerfile`.



---



## Dependencies & Execution Order



### Phase Dependencies



- **Setup (Phase 1)**: No dependencies.

- **Foundational (Phase 2)**: Depends on Setup completion.

- **User Stories (Phase 3-5)**: Depend on Foundational phase completion.

- **Polish (Phase 6)**: Depends on all user stories being complete.



### User Story Dependencies



- **User Story 1 (P1)**: Can start after Foundational (Phase 2).

- **User Story 2 (P2)**: Can start after Foundational (Phase 2).

- **User Story 3 (P3)**: Can start after Foundational (Phase 2).



### Parallel Opportunities



- All Setup tasks marked [P] can run in parallel.

- Once Foundational phase completes, all user stories can start in parallel.

- Models within a story marked [P] can be created in parallel.



---



## Implementation Strategy



### MVP First (User Story 1 Only)



1. Complete Phase 1: Setup

2. Complete Phase 2: Foundational

3. Complete Phase 3: User Story 1

4. **STOP and VALIDATE**: Test User Story 1 independently.



### Incremental Delivery



1. Complete Setup + Foundational.

2. Add User Story 1 → Test independently.

3. Add User Story 2 → Test independently.

4. Add User Story 3 → Test independently.

5. Each story adds value without breaking previous stories.

"observability" or "failure".

### Implementation for User Story 3

- [ ] T021 [P] [US3] Create `FailureMode` Pydantic model in `backend/src/models/api.py`.

- [ ] T022 [US3] Implement `FailureSimulationAgent` in `backend/src/sim_agents/failure_simulation.py`.
- [ ] T023 [US3] Implement `ObservabilityNarrativeAgent` in `backend/src/sim_agents/observability_narrative.py`.
- [ ] T024 [US3] Integrate failure mode injection into the simulation service.
- [ ] T025 [US3] Integrate observability stream generation into the simulation service.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T026 [P] Add structured logging to all services and agents.
- [ ] T027 [P] Implement comprehensive error handling and validation.
- [ ] T028 Write README for the backend service in `backend/README.md`.
- [ ] T029 Create a `Dockerfile` for the backend service in `backend/Dockerfile`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3-5)**: Depend on Foundational phase completion.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2).
- **User Story 2 (P2)**: Can start after Foundational (Phase 2).
- **User Story 3 (P3)**: Can start after Foundational (Phase 2).

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel.
- Once Foundational phase completes, all user stories can start in parallel.
- Models within a story marked [P] can be created in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently.

### Incremental Delivery

1. Complete Setup + Foundational.
2. Add User Story 1 → Test independently.
3. Add User Story 2 → Test independently.
4. Add User Story 3 → Test independently.
5. Each story adds value without breaking previous stories.