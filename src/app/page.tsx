import Hero from "./Sections/Hero";
import Services from "./Sections/Services";
import Stats from "./Sections/Stats";
import HowItWorks from "./Sections/HowItWorks";
import WhyChooseUs from "./Sections/WhyChooseUs";
import Testimony from "./Sections/Testimony";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="bg-gradient-to-br from-green-500 via-green-100 to-green-400 border-2 rounded text-dark px-5">
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
