import type { Access } from "payload";

/** Public read (the website renders this content). */
export const anyone: Access = () => true;

/** Any logged-in user (admin or editor) — content writes. */
export const authenticated: Access = ({ req }) => Boolean(req.user);

/** Admins only — users + site settings. */
export const adminsOnly: Access = ({ req }) => req.user?.role === "admin";
