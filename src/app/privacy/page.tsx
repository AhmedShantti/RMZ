import type { Metadata } from "next";
import LegalDoc, { type LegalSection } from "@/components/LegalDoc";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Rebel Mind Zone handles personal information. Template text.",
  robots: { index: false },
};

const sections: LegalSection[] = [
  {
    heading: "Information we collect",
    body: [
      "When you contact us through this site, we collect the information you choose to provide — typically your name, email address, and the contents of your message. We may also collect basic, non-identifying analytics about how the site is used.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "We use the information you send us to respond to your enquiry and, where relevant, to discuss a potential project. We do not sell your personal information.",
    ],
  },
  {
    heading: "Sharing",
    body: [
      "We share personal information only with service providers who help us operate this site or communicate with you, and only as needed for those purposes. We may disclose information where required by law.",
    ],
  },
  {
    heading: "Cookies & analytics",
    body: [
      "This site may use cookies or similar technologies to understand usage and improve the experience. You can control cookies through your browser settings.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You may request access to, correction of, or deletion of the personal information you have shared with us by contacting us at the address below. We will respond within a reasonable time.",
    ],
  },
  {
    heading: "Contact",
    body: [
      `Questions about this policy can be sent to ${site.email}. This document is placeholder boilerplate and must be reviewed by legal counsel before it is relied upon.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated="2026"
      intro="This Privacy Policy explains, in plain terms, what information Rebel Mind Zone collects through this website and how we handle it."
      sections={sections}
    />
  );
}
