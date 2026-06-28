# contact-form-Prompt.md
# Claude Code Prompt — Contact Form → Payload CMS Integration

---

## YOUR ROLE
You are refactoring a contact form in a marketing agency website. You must connect it to the Payload CMS database so submissions are stored and displayed in the Admin dashboard. You must not change any design or styling.

---

## PRIME DIRECTIVES (read before every file edit)
1. **Do NOT modify any CSS, Tailwind classes, styled-components, or JSX structure.**
2. **Do NOT delete or overwrite existing Payload collections.**
3. **Do NOT edit fields/access/hooks of any collection you did not create in this task.**
4. **Only change the submit handler in the frontend form — nothing else in that file.**
5. **Always scan before you write.** Check if a file or registration already exists before creating or adding it.

---

## STEP-BY-STEP INSTRUCTIONS

### STEP 1 — Scan the backend

Run the following checks in order:

```bash
# 1a. Find Payload config
find . -name "payload.config.*" -not -path "*/node_modules/*"

# 1b. List all collection files
ls src/collections/ 2>/dev/null || ls collections/ 2>/dev/null || echo "NO COLLECTIONS DIR FOUND"

# 1c. Check if a contact collection already exists
grep -ril "contact" src/collections/ 2>/dev/null || grep -ril "contact" collections/ 2>/dev/null

# 1d. Check if contact collection is registered in payload.config
grep -i "contact" $(find . -name "payload.config.*" -not -path "*/node_modules/*")
```

**Decision tree based on scan results:**

- **Collections dir does not exist** → Create `src/collections/` directory, then create `ContactSubmissions.ts`
- **Collections dir exists, no contact file** → Create `src/collections/ContactSubmissions.ts`
- **Contact file exists, missing fields** → Add only the missing fields (`name`, `email`, `message`) to the existing file
- **Contact file exists, all fields present** → Do not touch it; go to registration check
- **Collection already registered in payload.config** → Skip registration; go to Step 2
- **Collection not registered** → Add import and register in payload.config

---

### STEP 2 — Create the collection (only if needed from Step 1)

Create `src/collections/ContactSubmissions.ts` with this exact content:

```typescript
import { CollectionConfig } from 'payload/types'

const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'message', 'createdAt'],
    description: 'Contact form messages from the website',
  },
  access: {
    create: () => true,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email Address',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Message',
    },
  ],
  timestamps: true,
}

export default ContactSubmissions
```

---

### STEP 3 — Register in payload.config.ts (only if not already registered)

Open `payload.config.ts`. Add the import at the top with other collection imports:

```typescript
import ContactSubmissions from './collections/ContactSubmissions'
```

Inside the `buildConfig({ ... })` call, find the `collections` array and append `ContactSubmissions`:

```typescript
collections: [
  // ... existing collections remain untouched ...
  ContactSubmissions,
],
```

**Do not modify anything else in this file.**

---

### STEP 4 — Locate the contact form component

```bash
# Search for the form file
grep -ril "mailto" src/ --include="*.tsx" --include="*.jsx" --include="*.ts" --include="*.js" 2>/dev/null
grep -ril "ContactForm\|contact-form\|contactForm" src/ --include="*.tsx" --include="*.jsx" 2>/dev/null
```

Read the identified file completely before making any changes.

---

### STEP 5 — Refactor the submit handler (SURGICAL EDIT ONLY)

**What to find:** The submit handler — typically:
- An `<form action="mailto:...">` attribute
- A function doing `window.location.href = 'mailto:...'`
- A `handleSubmit` / `onSubmit` function that opens mail

**What to replace it with:**

```typescript
const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setFormStatus('loading')

  try {
    const response = await fetch('/api/contact-submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    })

    if (!response.ok) throw new Error('Submission failed')

    setFormStatus('success')
    // Reset fields if the component has a reset pattern
  } catch (err) {
    console.error('Contact form error:', err)
    setFormStatus('error')
  }
}
```

**If the component already has a status/loading state,** adapt the above to match the existing pattern instead of adding a new one.

**If the form uses uncontrolled inputs** (no React state for field values), read values via `e.currentTarget.elements`:
```typescript
const formData = new FormData(e.currentTarget as HTMLFormElement)
body: JSON.stringify({
  name: formData.get('name'),
  email: formData.get('email'),
  message: formData.get('message'),
})
```

**Remove or replace** the `action="mailto:..."` attribute on the `<form>` tag if present — change it to `onSubmit={handleSubmit}` and remove the `action` prop.

---

### STEP 6 — Validation pass

After all edits, confirm:

- [ ] `src/collections/ContactSubmissions.ts` exists and exports a valid CollectionConfig
- [ ] `payload.config.ts` imports and registers `ContactSubmissions`
- [ ] The form component no longer references `mailto`
- [ ] The form component calls `/api/contact-submissions` via fetch on submit
- [ ] Zero styling changes were made (run `git diff --stat` and confirm no `.css`, `.scss`, or Tailwind-only changes)
- [ ] TypeScript compiles: `npx tsc --noEmit` (if the project uses TypeScript)

---

### STEP 7 — Report back

Summarize what you did in this format:

```
✅ CREATED:  src/collections/ContactSubmissions.ts
✅ MODIFIED: src/payload.config.ts — added ContactSubmissions import + registration
✅ MODIFIED: src/components/ContactForm.tsx — replaced mailto handler with fetch POST

⚠️  SKIPPED: [anything you found already in place and did not change]

📋 NEXT STEPS FOR DEVELOPER:
1. Restart the dev server
2. Submit the form with test data
3. Visit /admin/collections/contact-submissions to confirm the submission appears
```

---

## WHAT SUCCESS LOOKS LIKE

| Where | What you see |
|-------|-------------|
| Browser — contact page | Form submits without opening Mail app; shows success message |
| Network tab | `POST /api/contact-submissions` returns `201` |
| Payload Admin | `/admin/collections/contact-submissions` shows a table with Name, Email, Message, Created At columns |
| Database | One new document/row per submission |
