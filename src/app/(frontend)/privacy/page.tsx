import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";
import { getLegal, getMeta } from "@/lib/cms";
import { lexicalToSections } from "@/lib/lexical";
import { privacyContent } from "@/content/legal";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMeta("legalPrivacy", {
    title: "Privacy Policy",
    description:
      "How Rebel Mind Zone handles personal information. Template text.",
  });
  return { title: m.title, description: m.description, robots: { index: false } };
}

export default async function PrivacyPage() {
  const doc = await getLegal("privacy");
  const sections = doc.body
    ? lexicalToSections(doc.body)
    : privacyContent.sections;

  return (
    <LegalDoc
      title={doc.title}
      updated={doc.lastUpdated}
      intro={doc.intro}
      sections={sections}
      showNotice={doc.showTemplateNotice}
    />
  );
}
