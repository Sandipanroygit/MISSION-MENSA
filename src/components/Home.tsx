import HeroSection from "@/components/Landing/Hero";
import HowItWorksSection from "@/components/Landing/HowItWorks";
import WhyFinwitKidsSection from "@/components/Landing/WhyFinwitKids";

const Home = () => {
  return (
    <main className="home-card-stack">
      <section className="home-card-panel home-card-panel-1">
        <div className="home-card-shell">
          <HeroSection />
        </div>
      </section>
      <section className="home-card-panel home-card-panel-2">
        <div className="home-card-shell">
          <WhyFinwitKidsSection />
        </div>
      </section>
      <section className="home-card-panel home-card-panel-3">
        <div className="home-card-shell">
          <HowItWorksSection />
        </div>
      </section>
    </main>
  );
};

export default Home;
