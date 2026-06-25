/** Main menu (overlay). Privacy & Terms live in the footer row, not here. */
export type NavItem = { label: string; href: string; index: string };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/", index: "01" },
  { label: "About Us", href: "/about", index: "02" },
  { label: "Services", href: "/services", index: "03" },
  { label: "Portfolio", href: "/portfolio", index: "04" },
  { label: "Careers", href: "/careers", index: "05" },
  { label: "Contact", href: "/contact", index: "06" },
];

export const legalNav: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy", index: "" },
  { label: "Terms & Conditions", href: "/terms", index: "" },
];
