import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Experience from "@/components/experience/Experience";
import Projects from "@/components/projects/Projects";
import Contact from "@/components/contact/Contact";
import {
  getHeroData,
  getAboutData,
  getContactInfo,
  getExperiences,
  getCareerStats,
  getProjects,
  getSiteVisibility,
} from "@/lib/db";

export default async function Home() {
  const [heroData, aboutData, contact, experiences, stats, projects, visibility] =
    await Promise.all([
      getHeroData(),
      getAboutData(),
      getContactInfo(),
      getExperiences(),
      getCareerStats(),
      getProjects(),
      getSiteVisibility(),
    ]);

  return (
    <main>
      {visibility.show_hero && <Hero data={heroData} />}
      {visibility.show_about && <About data={aboutData} />}
      {visibility.show_experience && (
        <Experience experiences={experiences} stats={stats} />
      )}
      {visibility.show_projects && <Projects projects={projects} />}
      {visibility.show_contact && <Contact contact={contact} />}
    </main>
  );
}