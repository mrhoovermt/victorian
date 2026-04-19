import { Nav } from "@/components/public/Nav";
import { Hero } from "@/components/public/Hero";
import { Gaming } from "@/components/public/Gaming";
import { FoodDrinks } from "@/components/public/FoodDrinks";
import { PlayersClub } from "@/components/public/PlayersClub";
// import { Catering } from "@/components/public/Catering";
import { TaxiSection } from "@/components/public/TaxiSection";
import { Gallery } from "@/components/public/Gallery";
import { Location } from "@/components/public/Location";
import { EmailSignup } from "@/components/public/EmailSignup";
import { Footer } from "@/components/public/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Gaming />
        <FoodDrinks />
        <PlayersClub />
        {/* <Catering /> */}
        <TaxiSection />
        <Gallery />
        <Location />
        <EmailSignup />
      </main>
      <Footer />
    </>
  );
}
