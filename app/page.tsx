import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { HowIWork } from "@/components/how-i-work";
import { Skills } from "@/components/skills";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Credentials } from "@/components/credentials";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="flex-1">
        <Hero />
        <Experience />
        <Projects />
        <About />
        <HowIWork />
        <Skills />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
