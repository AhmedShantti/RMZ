import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectHero from "@/components/portfolio/ProjectHero";
import ProjectBlocks from "@/components/portfolio/ProjectBlocks";
import ProjectPager from "@/components/portfolio/ProjectPager";
import { getProject, getProjectSlugs } from "@/lib/cms";

/**
 * Project case study — /portfolio/[slug].
 *
 * The page is a thin shell: fixed hero, the project's ordered blocks, then the
 * pager. All shape comes from the data, so a project with two blocks and a
 * project with ten both render correctly here without a change.
 *
 * Next 16: `params` is a Promise (see node_modules/next/dist/docs — dynamic
 * routes), typed by the generated `PageProps` helper.
 */

// Prerender every known project at build time. An unknown slug still resolves
// at request time and 404s via notFound() below.
export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/portfolio/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const found = await getProject(slug);

  if (!found) return { title: "Project not found" };

  const { project } = found;
  const description = project.result;

  return {
    title: `${project.name} — ${project.discipline}`,
    description,
    openGraph: {
      title: `${project.name} — ${project.discipline}`,
      description,
      type: "article",
      ...(project.cover?.src ? { images: [project.cover.src] } : {}),
    },
  };
}

export default async function ProjectPage(props: PageProps<"/portfolio/[slug]">) {
  const { slug } = await props.params;
  const found = await getProject(slug);

  // Unknown slug → the segment's not-found.tsx.
  if (!found) notFound();

  const { project, prev, next } = found;

  return (
    <article>
      <ProjectHero
        name={project.name}
        category={project.discipline}
        client={project.client}
        year={project.year}
        result={project.result}
        cover={project.cover}
      />

      <ProjectBlocks blocks={project.blocks} />

      <ProjectPager prev={prev} next={next} />
    </article>
  );
}
