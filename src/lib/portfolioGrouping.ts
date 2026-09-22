import type { Project } from "@/content/portfolio";

export type CategoryGroup = {
  /** The category doc's id — stable, safe for React keys. */
  key: string;
  label: string;
  /** Used for the section heading's element id — from the category doc's slug. */
  slug: string;
  sortOrder: number;
  projects: Project[];
};

/**
 * Groups projects by their `category` relationship (already populated by
 * getPortfolio()). Categories are ordered by `category.sortOrder`, projects
 * within a category by `project.sortOrder`. A category with no projects never
 * appears — there's nothing to derive an empty group from, since this only
 * groups the projects it's given.
 */
export function groupProjectsByCategory(projects: Project[]): CategoryGroup[] {
  const groups = new Map<string, CategoryGroup>();

  for (const project of projects) {
    const key = String(project.category.id);
    const existing = groups.get(key);
    if (existing) {
      existing.projects.push(project);
    } else {
      groups.set(key, {
        key,
        label: project.category.title,
        slug: project.category.slug,
        sortOrder: project.category.sortOrder,
        projects: [project],
      });
    }
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      projects: [...group.projects].sort((a, b) => a.sortOrder - b.sortOrder),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
