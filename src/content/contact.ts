import type { Run } from "@/components/RunsText";
import { site } from "./site.ts";

/** Contact page copy + form microcopy — default + seed source. */
export const contactContent = {
  // "Let's create a new STORY.."  (STORY italic, .. red, no space)
  heroStory: [
    { text: "Let’s create a new", style: "normal", tone: "cream" },
    { text: "STORY", style: "italic", tone: "cream" },
    { text: "..", style: "normal", tone: "red", noSpaceBefore: true },
  ] as Run[],
  lede: "Tell us what you’re making. The more honest the brief, the better the work — start anywhere.",
  whereWeWorkLabel: "Where we work",
  // Info bar — blank email = the site email (Site settings).
  officeAddress: "Office 102: Nasr City, Cairo, Egypt",
  emailLinkLabel: "Email us",
  form: {
    sendingLabel: "Sending…",
    sendAnotherLabel: "Send another →",
    submitError: "Something went wrong sending your message. Please try again in a moment.",
    labels: {
      fullName: "Full Name",
      email: "Email",
      company: "Company Name",
      phone: "Phone Number",
      country: "Country",
      countryPlaceholder: "Select country",
      message: "Give us a brief about your project",
    },
    countries: [
      "Egypt",
      "Saudi Arabia",
      "United Arab Emirates",
      "Kuwait",
      "Qatar",
      "Bahrain",
      "Oman",
      "Jordan",
      "Lebanon",
      "Other",
    ],
    recipientEmail: site.email,
    submitLabel: "Send it",
    successHeading: "Got it. Your message is on its way.",
    successBody:
      "We read everything ourselves and reply in our own words — usually within a couple of days.",
    errorSummary: "A couple of fields need a look before this can send.",
    fieldErrors: {
      nameRequired: "Tell us who you are.",
      emailRequired: "We need an email to reply to.",
      emailInvalid: "That email doesn't look right.",
      messageRequired: "Add a line about what you're making.",
    },
  },
};
