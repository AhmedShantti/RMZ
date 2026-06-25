import IntroLoader from "@/components/IntroLoader";
import HeroCursorField from "@/components/HeroCursorField";
import WordmarkMoment from "@/components/WordmarkMoment";
import ServicesTeaser from "@/components/ServicesTeaser";
import MarketsBlock from "@/components/MarketsBlock";

export default function Home() {
  return (
    <>
      <IntroLoader />
      <HeroCursorField />
      <WordmarkMoment />
      <ServicesTeaser />
      <MarketsBlock asTeaser />
    </>
  );
}
