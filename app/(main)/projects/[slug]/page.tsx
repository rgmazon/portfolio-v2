import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs } from "@/lib/db";
import ProjectDetail from "@/components/projects/ProjectDetail";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const firstImage =
    project.media.find((m) => m.type === "image")?.src ??
    project.media[0]?.poster;

  return {
    title: `${project.title} — RG Mazon`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: firstImage ? [firstImage] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: firstImage ? [firstImage] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
