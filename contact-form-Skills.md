# contact-form-Skills.md
# Skills & Knowledge Reference — Contact Form → Payload CMS Integration

## 1. Stack Assumptions
- **Frontend**: React / Next.js (App Router or Pages Router)
- **CMS / Dashboard**: [Payload CMS](https://payloadcms.com/) v2 or v3
- **Database**: MongoDB or PostgreSQL (whichever Payload is configured with)
- **API style**: Payload's built-in REST API (`/api/<collection-slug>`) or Local API

---

## 2. Payload CMS Core Concepts

### Collections
A **Collection** in Payload is a schema definition that maps directly to a database table/collection and auto-generates:
- REST endpoints: `POST /api/<slug>`, `GET /api/<slug>`, `GET /api/<slug>/:id`
- Admin UI panel (dashboard table view) automatically

### Collection Config File Pattern
```ts
// src/collections/ContactSubmissions.ts
import { CollectionConfig } from 'payload/types'

const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',   // → REST: /api/contact-submissions
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'message', 'createdAt'],
    description: 'Incoming contact form messages',
  },
  access: {
    create: () => true,          // public can POST
    read: ({ req }) => !!req.user, // only authenticated admins can read
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'name',    type: 'text',     required: true },
    { name: 'email',   type: 'email',    required: true },
    { name: 'message', type: 'textarea', required: true },
  ],
  timestamps: true,   // adds createdAt + updatedAt automatically
}

export default ContactSubmissions
```

### Registering a Collection in payload.config.ts
```ts
import ContactSubmissions from './collections/ContactSubmissions'

export default buildConfig({
  collections: [
    // ...existing collections
    ContactSubmissions,   // ← add here
  ],
})
```

---

## 3. Frontend Submission Pattern

### Replace `mailto:` / `<form action="mailto:">` with a `fetch` POST
```ts
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const res = await fetch('/api/contact-submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  })
  if (res.ok) {
    // show success state
  } else {
    // show error state
  }
}
```

### Key Rules
- **Do NOT change any JSX markup, classNames, or CSS** — only replace the submit handler logic.
- Keep all existing field `name` / `id` / `placeholder` attributes intact.
- Preserve any existing validation logic (required, email format checks).
- Add loading + success + error UI states *only* if the component already has a pattern for it; otherwise add minimal inline feedback.

---

## 4. CORS & API Route Considerations

### Same-origin (Next.js + Payload in one repo)
No CORS config needed — the frontend and `/api` share the same origin.

### Separate repos / different ports
Add the frontend origin to Payload's CORS whitelist in `payload.config.ts`:
```ts
cors: ['http://localhost:3000', 'https://yourdomain.com'],
```

---

## 5. Payload Admin Dashboard — Table View

When the collection is registered and `admin.defaultColumns` is set, Payload automatically renders a sortable, searchable table in the Admin UI at:
```
/admin/collections/contact-submissions
```
No extra configuration is needed for the table view.

Optional enhancements (do NOT implement unless explicitly requested):
- Custom cell renderers
- Filters / facets
- Export to CSV

---

## 6. File Scan Checklist (Claude Code must verify before writing)

| Check | How |
|-------|-----|
| Does `src/collections/` (or `collections/`) exist? | `ls src/collections` |
| Does a contact-related collection already exist? | grep for "contact" in collection files |
| Is `payload.config.ts` (or `.js`) present? | `find . -name "payload.config*"` |
| Is the collection already registered in config? | grep for "contact" in payload.config |
| Does the frontend form use `mailto:` or `action="mailto:`? | grep form file |
| Does the form already import/use `fetch`? | check submit handler |

---

## 7. Safety Constraints

1. **Never delete or overwrite existing collections.**
2. **Never modify `fields`, `access`, or `hooks` of other collections.**
3. **Never touch styling files** (`.css`, `.scss`, Tailwind classes, styled-components).
4. **Never remove existing form JSX** — only replace the submit/action logic.
5. If a contact collection already exists with a different schema, **extend it** (add missing fields) rather than replace it.
