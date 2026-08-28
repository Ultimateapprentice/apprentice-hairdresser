# Migration Checklist

## Phase 0 — Repository
- [ ] Copy the existing source into this repository.
- [ ] Preserve the original source in Git before refactoring.
- [ ] Confirm `SoT.md` is the active source of truth.

## Phase 1 — Decouple
- [ ] Search repository for `ivorey`.
- [ ] Remove Ivorey SDK/API/runtime dependencies.
- [ ] Confirm local `npm install` and `npm run dev`.
- [ ] Confirm `npm run build`.

## Phase 2 — Inventory
- [ ] Migrate existing pages.
- [ ] Migrate existing components.
- [ ] Migrate context/state.
- [ ] Migrate hooks.
- [ ] Migrate training data.
- [ ] Migrate tests.

## Phase 3 — Production platform
- [ ] Select SQL database.
- [ ] Select authentication provider.
- [ ] Select evidence storage.
- [ ] Implement API/service layer.
- [ ] Implement role-based access.

## Phase 4 — Product workflows
- [ ] Apprentice activity completion.
- [ ] Evidence upload.
- [ ] Evidence review.
- [ ] Revision workflow.
- [ ] Unit assessment/sign-off.
- [ ] Employer read-only access.
- [ ] Admin management.
- [ ] Reporting.

## Phase 5 — Production
- [ ] Security review.
- [ ] Responsive testing.
- [ ] E2E testing.
- [ ] Cloudflare staging.
- [ ] Custom domain.
- [ ] Production deployment.
