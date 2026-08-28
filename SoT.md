# Source of Truth (SoT)
## Apprentice Hairdresser Competency & Compliance Platform

**Status:** Authoritative development specification  
**Purpose:** Source of truth for the standalone application migration and ongoing development.

> This document supersedes the earlier Bubble.io implementation direction where it conflicts with the standalone React/Cloudflare architecture. The product requirements, roles, workflows and data concepts from the original material remain in scope.

---

## 1. Objective

Extract the existing Apprentice Hairdresser Competency & Compliance application from the Ivorey environment and convert it into a standalone, maintainable, production-ready web application.

The application must:

- Preserve the existing user experience and functional behaviour.
- Remove dependency on Ivorey.
- Be maintained from GitHub.
- Run locally in the developer environment.
- Build reproducibly with npm.
- Deploy independently through Cloudflare.
- Support persistent production data.
- Support authenticated users and role-based permissions.
- Support Apprentices, Assessors/Trainers, Employers/Salon Owners and Admin/RTO users.
- Provide a foundation for future development without dependence on the original prototype platform.

## 2. Target Architecture

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Existing shadcn/ui / Radix UI component library
- React Router
- React Hook Form
- Zod
- TanStack React Query where appropriate
- Lucide icons

### Platform
- GitHub is the authoritative source repository.
- Cloudflare is the production deployment platform.
- SQL database is required for persistent production data.
- Authentication must be production-grade.
- Evidence photographs require persistent file/object storage.

### Architecture principle

Separate:

1. Presentation — React pages/components
2. Application logic — hooks/services/context
3. API/data layer — typed service abstraction
4. Database — production SQL
5. Authentication — production auth
6. File storage — persistent evidence storage
7. Deployment — Cloudflare

React UI code must not be tightly coupled to the database implementation.

## 3. Ivorey Decoupling

Ivorey is the source/development environment being exited.

The new application must not depend on:

- Ivorey SDKs
- Ivorey APIs
- Ivorey authentication
- Ivorey environment variables
- Ivorey deployment tooling
- Ivorey-specific wrappers
- Ivorey-specific runtime behaviour

Search the entire repository for `ivorey`.

Any remaining reference must be deliberate and documented; otherwise remove or replace it.

## 4. Repository Structure

The target repository should follow this general structure:

```text
apprentice-hairdresser/
├── public/
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── AppShell.tsx
│   │   ├── NavLink.tsx
│   │   └── UnitDetailView.tsx
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── database/
│   │   ├── storage/
│   │   └── validation/
│   ├── pages/
│   ├── test/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── README.md
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
└── wrangler.jsonc
```

Generated directories such as `node_modules`, `dist`, `.vite` and coverage output must not be committed.

## 5. Core Product

The product is a competency and compliance dashboard for apprentice hairdressers.

It tracks:

- Training units
- Core/elective status
- Workplace activities
- Activity completion
- Evidence
- Apprentice notes/reflections
- Trainer/assessor feedback
- Unit assessments
- Assessor sign-off
- Overall apprentice progress

The initial product reference contains 21 Core and 12 Elective units. Elective training-package codes must be validated before production seeding.

## 6. User Roles

### Apprentice

Can:
- Log in
- View own dashboard
- View own training units
- View unit details
- Complete workplace activities
- Upload photographic evidence
- Add notes/reflections
- View evidence status
- View trainer feedback
- View assessor sign-offs
- View own progress

Cannot:
- View another apprentice's private information
- Modify assessment/sign-off information
- Approve evidence
- Manage training units

### Assessor / Trainer

Can:
- Log in
- View assigned apprentices
- View apprentice progress
- View apprentice units
- Review workplace activities
- Review evidence
- Approve evidence
- Request evidence revision
- Add trainer feedback
- Complete unit assessments
- Sign off units
- Add assessment comments

### Employer / Salon Owner

Can:
- Log in
- View assigned apprentice progress
- View unit status
- View completed/assessed units
- View assessor comments
- View evidence photographs

Employer access is read-only.

### Admin / RTO

Can:
- Manage users
- Manage training units
- Manage workplace activities
- Assign apprentices to assessors
- Assign apprentices to employers
- Export compliance reports
- Maintain system configuration

## 7. Logical Data Model

### User

```text
id
email
password/auth reference
fullName
role
salonName
avatar
assignedAssessorId
assignedEmployerId
apprenticeshipStartDate
targetCompletionDate
createdAt
updatedAt
```

### TrainingUnit

```text
id
unitCode
title
type
moduleCategory
overview
requiredCount
sortOrder
createdAt
updatedAt
```

`type`: `core` | `elective`

### KeyFocusArea

```text
id
unitId
title
description
sortOrder
```

### WorkplaceActivity

```text
id
unitId
section
title
description
sortOrder
required
```

### ActivityLog

One record represents an apprentice's progress against a workplace activity.

```text
id
apprenticeId
activityId
completed
completedDate
notes
evidencePhotos
trainerSignedOff
trainerId
trainerName
trainerNotes
status
createdAt
updatedAt
```

Status:
- Pending
- Approved
- Needs Revision

### UnitAssessment

```text
id
apprenticeId
unitId
assessorId
assessorName
assessed
assessorComments
assessmentDate
createdAt
updatedAt
```

### EvidenceRecord

```text
id
apprenticeId
unitId
activityId
unitCode
unitTitle
activityTitle
description
photo
status
trainerFeedback
date
createdAt
updatedAt
```

Evidence status:
- Pending Review
- Approved
- Needs Revision

## 8. Database Requirement

The prototype's in-memory state must be replaced by persistent production storage.

The production SQL technology is an architecture decision, but the application must be designed so the React UI does not depend directly on the selected SQL implementation.

The database must support:
- Users
- Roles
- Training units
- Activities
- Apprentice activity records
- Evidence
- Assessments
- Assessor/apprentice relationships
- Employer/apprentice relationships

Database schema and migrations belong in Git.

## 9. Authentication & Authorisation

Implement:
- Login
- Logout
- Account creation where permitted
- Session management
- Protected routes
- Role-based access
- Server/API-side authorisation
- Data-level authorisation

Do not rely on hiding UI controls as the security mechanism.

An apprentice must only be able to access their own permitted records.

## 10. Required Pages

### Shared
- Login
- Signup
- Profile Settings

### Apprentice
- Dashboard
- Unit Detail
- Quick Upload
- Evidence Portfolio

### Assessor / Trainer
- Apprentice List
- Apprentice Unit Review
- Assessment Form
- Evidence Review Queue

### Employer
- Progress Overview
- Evidence Gallery

### Admin
- User Management
- Unit Management
- Activity Management
- Compliance Report Export

## 11. Required Workflows

### Complete Activity

1. Apprentice selects activity.
2. Create/update ActivityLog.
3. Set Completed = true.
4. Record completion date.
5. Recalculate progress.
6. Update dashboard.
7. Persist changes.

### Upload Evidence

1. Select unit/activity.
2. Select photograph.
3. Add notes.
4. Upload to persistent storage.
5. Create EvidenceRecord.
6. Set status to Pending Review.
7. Create/update ActivityLog.
8. Display confirmation.

### Approve Evidence

1. Assessor opens pending evidence.
2. Reviews photograph and notes.
3. Approves.
4. Updates EvidenceRecord.
5. Records approval.
6. Updates ActivityLog.
7. Set trainer sign-off where applicable.

### Request Revision

1. Assessor opens evidence.
2. Selects Needs Revision.
3. Adds feedback.
4. Evidence becomes Needs Revision.
5. Apprentice sees feedback.
6. Apprentice can submit replacement/additional evidence.

### Unit Sign-Off

1. Assessor opens apprentice/unit.
2. Reviews required activities/evidence.
3. Enters assessment comments.
4. Signs off.
5. Create/update UnitAssessment.
6. Record assessor and date.
7. Display Assessed status.
8. Notify employer where configured.

### Employer View

Employer can view only assigned apprentices and has no modification capability.

## 12. Progress Calculation

At minimum:

```text
Unit Progress =
completed required activities
/
total required activities
× 100
```

Optional/non-required activities must not be treated as required completion.

Progress must be calculated from persisted records rather than UI-only state.

## 13. Evidence Storage

Evidence photographs require persistent storage.

Requirements:
- Upload
- Secure storage
- Retrieval
- Access control
- File validation
- File size limits
- Image preview
- Error handling
- Replacement/additional evidence

Evidence must remain associated with:

```text
Apprentice
  ↓
Training Unit
  ↓
Workplace Activity
  ↓
Evidence
```

## 14. Notifications

Support:
- Evidence submitted → assessor
- Evidence revision requested → apprentice
- Evidence approved → apprentice
- Unit signed off → employer where configured

## 15. Design System

Preserve the existing Slate & Steel design language.

```text
Background:       #f8fafc
Cards/Panels:     #ffffff
Borders:          #e2e8f0
Primary text:     #0f172a
Muted text:       #475569
Primary buttons:  #0f172a
Accent/links:     #475569
Assessed:         #10b981
Pending:          #f59e0b
```

Fonts:
- Headings: Outfit
- Body: Figtree

Do not introduce a replacement visual system without approval.

## 16. Responsive Design

Support:
- Desktop
- Laptop
- Tablet
- Mobile

Pay particular attention to:
- Activity checklists
- Evidence upload
- Photograph viewing
- Dashboard cards
- Assessor queues
- Navigation

## 17. Testing

The application must support:

```bash
npm run lint
npm test
npm run build
```

Testing should cover:
- Progress calculations
- Status calculations
- Validation
- Permissions
- Activity completion
- Evidence submission
- Evidence approval
- Revision requests
- Unit sign-off
- Critical user journeys

Playwright should be used for critical end-to-end journeys when the test environment is established.

## 18. Git Requirements

GitHub is the authoritative source repository.

Never commit:
- `.env`
- `.env.local`
- production secrets
- API keys
- database passwords
- Cloudflare tokens
- private certificates
- SSH keys

Use `.env.example` with variable names only.

## 19. Cloudflare Deployment

The application must be independently deployable to Cloudflare.

Required production capabilities:
- HTTPS
- Custom domain
- DNS management
- Production environment variables
- Automated deployment from GitHub
- Preview/staging capability where practical
- Rollback capability

The repository contains `wrangler.jsonc` as the Cloudflare deployment configuration entry point.

The exact database/auth/storage providers must remain replaceable through the service/API layer.

## 20. Environment Configuration

Environment-specific configuration must be externalised.

Example variables:

```text
DATABASE_URL=
AUTH_URL=
API_URL=
STORAGE_URL=
STORAGE_BUCKET=
```

Actual values must never be committed.

Development, staging and production must use separate credentials/configuration.

## 21. Security

Production must implement:
- Authentication
- Authorisation
- Role-based access
- Data isolation
- Secure file access
- Input validation
- Server-side validation
- Secure environment variables
- Protection against unauthorised record access
- Auditability of assessment/sign-off actions

Evidence photographs and apprentice information must be treated as protected application data.

## 22. Compliance & Privacy

Provide for:
- Privacy policy
- Data retention policy/configuration
- User data access controls
- Appropriate deletion/archive processes
- Secure evidence storage
- Controlled reporting/export

## 23. Training Data

`src/data/trainingData.ts` is the reference source for existing training data.

The initial reference contains:
- 21 Core units
- 12 Elective units

Before production seeding:
1. Extract existing training data.
2. Preserve descriptions and activities.
3. Validate unit codes.
4. Validate core/elective classification.
5. Seed production.
6. Record seed version/date.

Do not treat sample elective entries as authoritative until verified.

## 24. Migration Strategy

### Stage 1 — Preserve
Put the existing source into GitHub before destructive changes.

### Stage 2 — Inventory
Identify:
- Pages
- Components
- Routes
- Context/state
- Data
- Hooks
- Services
- External dependencies
- Ivorey references

### Stage 3 — Decouple
Remove/replace Ivorey dependencies.

### Stage 4 — Stabilise frontend
Ensure:

```bash
npm install
npm run dev
npm run build
```

work independently.

### Stage 5 — Implement backend
Add:
- Database
- API/service layer
- Authentication
- File storage
- Persistent application state

### Stage 6 — Permissions
Test every role against every protected resource.

### Stage 7 — Seed data
Import validated training data.

### Stage 8 — Testing
Run automated and manual acceptance tests.

### Stage 9 — Cloudflare staging
Deploy staging.

### Stage 10 — Production
Configure production domain/DNS and deploy.

## 25. Definition of Done

### Repository
- [ ] Application exists in GitHub.
- [ ] No accidental Ivorey dependency remains.
- [ ] README explains setup/deployment.
- [ ] Secrets excluded.
- [ ] `.env.example` exists.

### Frontend
- [ ] React application builds.
- [ ] Existing UI preserved.
- [ ] Routing works.
- [ ] Responsive layouts work.
- [ ] Existing reusable UI components work.

### Authentication
- [ ] Users authenticate.
- [ ] Sessions work.
- [ ] Roles enforced.
- [ ] Protected routes work.

### Apprentice
- [ ] Dashboard
- [ ] Units
- [ ] Activities
- [ ] Completion
- [ ] Progress
- [ ] Evidence upload
- [ ] Evidence status
- [ ] Trainer feedback

### Assessor
- [ ] Assigned apprentices
- [ ] Progress
- [ ] Evidence queue
- [ ] Approve evidence
- [ ] Request revision
- [ ] Feedback
- [ ] Unit sign-off

### Employer
- [ ] Assigned apprentices
- [ ] Progress
- [ ] Assessment information
- [ ] Evidence
- [ ] Read-only enforcement

### Admin
- [ ] User management
- [ ] Apprentice assignments
- [ ] Unit management
- [ ] Activity management
- [ ] Compliance export

### Data
- [ ] Persistent database
- [ ] Validated training data
- [ ] Relationships
- [ ] Persistent evidence
- [ ] Persistent assessments

### Deployment
- [ ] Production build
- [ ] Cloudflare deployment
- [ ] Custom domain
- [ ] HTTPS
- [ ] Environment configuration
- [ ] GitHub deployment workflow

### Testing
- [ ] Unit tests
- [ ] Component tests
- [ ] Critical workflow tests
- [ ] Mobile testing
- [ ] Security/role testing

## 26. Implementation Priority

### P0 — Foundation
1. GitHub repository
2. Standalone React/Vite application
3. Remove Ivorey dependencies
4. Existing UI/components
5. Routing
6. Build pipeline

### P1 — Core platform
7. Database
8. Authentication
9. User roles
10. Training units
11. Workplace activities
12. Apprentice progress

### P2 — Evidence
13. Persistent photo storage
14. Evidence submission
15. Evidence review
16. Trainer feedback

### P3 — Assessment
17. Assessor dashboard
18. Unit assessment
19. Sign-off
20. Employer notification

### P4 — Employer
21. Employer dashboard
22. Evidence gallery
23. Read-only permissions

### P5 — Administration
24. User management
25. Unit management
26. Activity management
27. Compliance exports

### P6 — Production
28. Testing
29. Security review
30. Responsive testing
31. Privacy/data retention
32. Cloudflare production deployment

## 27. Development Rule

Do not rewrite working functionality merely for the sake of rewriting it.

Where existing code is sound:
- Preserve it.
- Refactor only where necessary.
- Connect it to the new backend.

Where code is Ivorey-specific:
- Replace it with application-owned functionality.

Where data is temporary/in-memory:
- Replace it with persistent production data.

Where training data is sample data:
- Preserve as reference.
- Validate.
- Seed only after validation.

Where UI infrastructure is reusable:
- Reuse it.

## 28. Final Target State

```text
GitHub
  ↓
React + TypeScript + Vite
  ↓
Application / Service Layer
  ├── Authentication
  ├── API
  └── File Storage
  ↓
SQL Database
  ↓
Cloudflare Production
```

The finished product must no longer be an Ivorey application.

Ivorey should become irrelevant to ongoing development and operation.

GitHub, application code, database architecture, authentication, storage, deployment and operational configuration become the application's owned technology stack.

## 29. Source Hierarchy

When making implementation decisions, use this hierarchy:

1. This `SoT.md`
2. Existing React source code and working behaviour
3. Existing UI implementation
4. `src/data/trainingData.ts`
5. Validated training-package data
6. Other repository documentation

If another document conflicts with this SoT, this SoT controls unless explicitly amended.

---

**Change control:** Any material change to architecture, roles, permissions, workflows, data model or deployment target should be recorded in this document before implementation.
