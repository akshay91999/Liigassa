import HomePage from "./Sections/HomePage";
import AboutPage from "./about/page";
import TeamsPage from "./teams/page";
import PlayersPage from "./players/page";

export default function Home() {
  return (
    // <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
       <div>
        <HomePage/>
        <AboutPage/>
        <TeamsPage/>
        <PlayersPage/>
       </div>
    // </div>
  );
}
