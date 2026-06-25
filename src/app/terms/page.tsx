import type { Metadata } from "next";
import LegalDoc, { type LegalSection } from "@/components/LegalDoc";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing use of the Rebel Mind Zone website. Template text.",
  robots: { index: false },
};

const sections: LegalSection[] = [
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
];

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms & Conditions"
      updated="2026"
      intro="These Terms & Conditions govern your use of the Rebel Mind Zone website."
      sections={sections}
    />
  );
}
