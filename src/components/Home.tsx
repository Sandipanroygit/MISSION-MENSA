import HeroSection from "@/components/Landing/Hero";
import HowItWorksSection from "@/components/Landing/HowItWorks";
import TalentAcquisitionSection from "@/components/Landing/TalentAcquisition";
import WhyFinwitKidsSection from "@/components/Landing/WhyFinwitKids";

const Home = () => {
  return (
    <main className="landing-page">
      <div className="landing-page__ambient" aria-hidden="true" />

      <section className="landing-page__hero-frame">
        <div className="landing-page__hero-shell">
          <HeroSection />
        </div>
      </section>

      <section id="collective-intelligence" className="landing-page__section">
        <div className="landing-page__section-shell landing-page__section-shell--mint">
          <WhyFinwitKidsSection />
        </div>
      </section>

      <section id="programme-navigation" className="landing-page__section">
        <div className="landing-page__section-shell landing-page__section-shell--sky">
          <HowItWorksSection />
        </div>
      </section>

      <section id="talent-acquisition" className="landing-page__section">
        <div className="landing-page__section-shell landing-page__section-shell--gold">
          <TalentAcquisitionSection />
        </div>
      </section>
    </main>
  );
};

export default Home;
