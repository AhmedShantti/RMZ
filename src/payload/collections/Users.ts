import type { Access, CollectionConfig } from "payload";
import { adminsOnly } from "../access.ts";

/** Admins see/edit everyone; a non-admin is scoped to their own record. */
const adminOrSelf: Access = ({ req }) =>
  req.user?.role === "admin"
    ? true
    : { id: { equals: req.user?.id ?? null } };

/**
 * Admin accounts. Payload auth (httpOnly cookies, CSRF). No public sign-up —
 * `create` is restricted to admins; the first admin is seeded from env.
 * Roles: `admin` (everything incl. users + settings) / `editor` (content only).
 */
export const Users: CollectionConfig = {
  slug: "users",
  // No public registration. Only admins create/list/delete users; a user may
  // read/update their own record.
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: adminOrSelf,
    update: adminOrSelf,
    admin: ({ req }) => Boolean(req.user), // both roles can open the dashboard
  },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8h sessions
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 min lockout (login rate-limit)
    cookies: {
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role"],
    group: "Admin",
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      access: {
        // only admins may change roles
        update: ({ req }) => req.user?.role === "admin",
      },
      admin: { description: "Admin = everything. Editor = content only." },
    },
  ],
};
