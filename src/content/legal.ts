import { site } from "./site.ts";

/** Legal pages — default + seed source. Body kept as sections; the seed
 *  converts to Lexical rich text; the public page renders it back to the same
 *  numbered-heading layout. Template boilerplate — review with counsel. */
export type LegalSection = { heading: string; body: string[] };
export type LegalDocContent = {
  title: string;
  lastUpdated: string;
  showTemplateNotice: boolean;
  intro: string;
  sections: LegalSection[];
};

export const privacyContent: LegalDocContent = {
  title: "Privacy Policy",
  lastUpdated: "2026",
  showTemplateNotice: true,
  intro:
    "This Privacy Policy explains, in plain terms, what information Rebel Mind Zone collects through this website and how we handle it.",
  sections: [
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
  ],
};

export const termsContent: LegalDocContent = {
  title: "Terms & Conditions",
  lastUpdated: "2026",
  showTemplateNotice: true,
  intro:
    "These Terms & Conditions govern your use of the Rebel Mind Zone website.",
  sections: [
    {
      heading: "Acceptance of terms",
      body: [
        "By accessing or using this website, you agree to these Terms & Conditions. If you do not agree, please do not use the site.",
      ],
    },
    {
      heading: "Use of the site",
      body: [
        "You may use this site for lawful, personal and business purposes. You agree not to misuse the site, interfere with its operation, or attempt to access it in any way other than through the interface we provide.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "The Rebel Mind Zone name, the rmz wordmark, and the content, design and code of this site are owned by Rebel Mind Zone or its licensors and are protected by applicable law. You may not reproduce them without permission.",
      ],
    },
    {
      heading: "Project work",
      body: [
        "Any engagement for creative services is governed by a separate written agreement. Nothing on this site constitutes an offer, quote, or binding commitment to provide services.",
      ],
    },
    {
      heading: "Disclaimer & liability",
      body: [
        "This site is provided “as is”, without warranties of any kind. To the fullest extent permitted by law, Rebel Mind Zone is not liable for any loss arising from your use of, or inability to use, the site.",
      ],
    },
    {
      heading: "Changes & contact",
      body: [
        `We may update these terms from time to time; the current version always lives at this address. Questions can be sent to ${site.email}. This document is placeholder boilerplate and must be reviewed by legal counsel before it is relied upon.`,
      ],
    },
  ],
};
