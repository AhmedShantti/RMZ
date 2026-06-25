import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";
import { getLegal, getMeta } from "@/lib/cms";
import { lexicalToSections } from "@/lib/lexical";
import { termsContent } from "@/content/legal";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMeta("legalTerms", {
    title: "Terms & Conditions",
    description:
      "The terms governing use of the Rebel Mind Zone website. Template text.",
  });
  return { title: m.title, description: m.description, robots: { index: false } };
}

export default async function TermsPage() {
  const doc = await getLegal("terms");
  const sections = doc.body ? lexicalToSections(doc.body) : termsContent.sections;

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
