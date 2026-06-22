import { LazyMotion, domAnimation } from "framer-motion";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Services from "./components/Services";
import Process from "./components/Process";
import About from "./components/About";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen overflow-x-hidden">
        <Header />
        <main>
          <Hero />
          <Work />
          <Services />
          <Process />
          <About />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </LazyMotion>
  );
}
