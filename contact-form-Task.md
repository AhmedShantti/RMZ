# contact-form-Task.md
# Task Breakdown — Contact Form → Payload CMS Integration

---

## TASK OVERVIEW
Refactor the existing contact form so submissions are stored in the Payload CMS database and displayed as a table in the Payload Admin dashboard.

**Scope:**
- ✅ Backend: Create/verify Payload collection for contact submissions
- ✅ Frontend: Replace mailto/form-action with a fetch POST call
- ✅ Dashboard: Submissions visible as a table in Payload Admin
- ❌ Do NOT change form design, markup, or styles

---

## PHASE 1 — Backend Scan & Setup

### Task 1.1 — Locate Payload config
- [ ] Find `payload.config.ts` (or `.js`) by scanning the project root and `src/`
- [ ] Read the file to identify: existing collections list, database adapter, CORS settings
- [ ] Note the collections directory path (commonly `src/collections/`)

### Task 1.2 — Scan for existing contact collection
- [ ] List all files in the collections directory
- [ ] Search for any file containing "contact" (case-insensitive) in its name or slug
- [ ] **If found:** Read it, check if `name`, `email`, `message` fields exist
  - Missing fields → add them (non-destructively)
  - All fields present → skip creation, proceed to registration check
- [ ] **If not found:** Create `ContactSubmissions.ts` (see Skills file §2)

### Task 1.3 — Register collection in Payload config
- [ ] Check if `ContactSubmissions` (or equivalent) is already imported and listed in `collections: [...]`
- [ ] **If missing:** Add import and register it
- [ ] **If present:** No action needed

### Task 1.4 — CORS check
- [ ] Determine if frontend and Payload share the same Next.js app (monorepo) or are separate
- [ ] If separate origins: verify `cors` array in `payload.config.ts` includes the frontend URL
- [ ] If same origin: skip

---

## PHASE 2 — Frontend Refactor

### Task 2.1 — Locate the contact form component
- [ ] Search for the form file: look for components named `ContactForm`, `Contact`, or files containing `mailto` or `action="mailto:`
- [ ] Read the full component to understand: current submit mechanism, field names, existing state management, existing validation

### Task 2.2 — Replace submit logic only
- [ ] Remove / comment out the `mailto` action or `window.location.href = 'mailto:...'` call
- [ ] Add a `fetch` POST to `/api/contact-submissions` with `{ name, email, message }` as JSON body
- [ ] Wrap in try/catch; handle loading, success, and error states using whatever pattern is already in the component (if none exists, add a minimal `status` state variable)
- [ ] **Do NOT touch:** JSX structure, className, CSS imports, field labels, placeholders, or validation rules

### Task 2.3 — Verify field name mapping
- [ ] Confirm the values sent in the fetch body match the Payload collection field names exactly:
  - `name` → `name`
  - `email` → `email`
  - `message` → `message`

---

## PHASE 3 — Dashboard Verification

### Task 3.1 — Confirm Admin UI table
- [ ] Verify `admin.defaultColumns` in the collection includes `['name', 'email', 'message', 'createdAt']`
- [ ] Verify `admin.useAsTitle` is set to `'name'` or `'email'`
- [ ] Confirm the collection will appear at `/admin/collections/contact-submissions`

### Task 3.2 — Access control review
- [ ] `create` access: must be public (`() => true`) so unauthenticated visitors can submit
- [ ] `read` / `update` / `delete`: must be admin-only (`({ req }) => !!req.user`)

---

## PHASE 4 — Final Checks

### Task 4.1 — Diff review
- [ ] No styling files were modified
- [ ] No existing collection files were deleted or overwritten
- [ ] No existing form JSX was removed (only submit handler changed)
- [ ] Payload config compiles without errors (run `tsc --noEmit` if TypeScript)

### Task 4.2 — Smoke test instructions (for developer)
1. Start the dev server
2. Submit the contact form with test data
3. Open `/admin/collections/contact-submissions`
4. Confirm the row appears with correct name, email, message, and timestamp

---

## DELIVERABLES SUMMARY

| File | Action |
|------|--------|
| `src/collections/ContactSubmissions.ts` | Create (if not exists) or extend |
| `src/payload.config.ts` | Add collection import + registration (if missing) |
| `<ContactForm component file>` | Replace submit handler only |
