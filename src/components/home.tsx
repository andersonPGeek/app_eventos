import React from "react";
import DashboardHeader from "./DashboardHeader";
import EventSchedule from "./EventSchedule";
import CheckInSection from "./CheckInSection";
import SponsorShowcase from "./SponsorShowcase";
import Marketplace from "./Marketplace";

interface HomeProps {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
  isCheckedIn?: boolean;
}

const Home = ({
  user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  isCheckedIn = false,
}: HomeProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventSchedule />
          </div>
          <div className="lg:col-span-1">
            <CheckInSection isCheckedIn={isCheckedIn} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="w-full overflow-hidden">
            <SponsorShowcase />
          </div>
          <Marketplace />
        </div>
      </main>
    </div>
  );
};

export default Home;
