import { TravelProvider } from "../context/TravelContext";
import TravelPlannerApp from "@/components/TravelPlannerApp";

export default function Home() {
  return (
    <TravelProvider>
      <TravelPlannerApp />
    </TravelProvider>
  );
}