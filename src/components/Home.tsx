import HeroSection from "@/components/Landing/Hero";
import HowItWorksSection from "@/components/Landing/HowItWorks";
import WhyFinwitKidsSection from "@/components/Landing/WhyFinwitKids";

const Home = () => {
  return (
    <main className="min-h-screen ">
      <HeroSection />
      <WhyFinwitKidsSection />
      <HowItWorksSection />
    </main>
  );
};

export default Home;
