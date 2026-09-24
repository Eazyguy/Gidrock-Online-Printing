import Hero from "./Sections/Hero";
import Services from "./Sections/Services";
import Stats from "./Sections/Stats";
import HowItWorks from "./Sections/HowItWorks";
import WhyChooseUs from "./Sections/WhyChooseUs";
import Testimony from "./Sections/Testimony";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="background">
          <Hero />
          <Services />
          <Stats />
          <HowItWorks />
          <WhyChooseUs />
          <Testimony />
         </main>  
    </div>
  );
}
