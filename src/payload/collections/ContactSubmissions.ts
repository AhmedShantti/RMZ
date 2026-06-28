import type { CollectionConfig } from "payload";

/**
 * Contact form messages from the website (contact-form-Task.md).
 *
 * Schema per the task spec. Import + named export follow this project's Payload
 * v3 convention (the spec's `payload/types` default-export snippet is v2).
 * REST: POST /api/contact-submissions (public create); reads/edits are admin
 * only. Visible in the admin at /studio/collections/contact-submissions.
 */
export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "message", "createdAt"],
    description: "Contact form messages from the website",
  },
  access: {
    create: () => true, // public visitors can submit
    read: ({ req }) => !!req.user, // authenticated admins only
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Full Name",
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "Email Address",
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      label: "Message",
    },
  ],
  timestamps: true,
};
