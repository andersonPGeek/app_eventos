import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import SponsorCard from "./SponsorCard";

interface Sponsor {
  name: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
  logo: string;
  description: string;
  website: string;
}

interface SponsorShowcaseProps {
  sponsors?: Sponsor[];
}

const defaultSponsors: Sponsor[] = [
  {
    name: "TechCorp Global",
    tier: "platinum",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TC",
    description: "Leading technology solutions provider for enterprise events",
    website: "https://example.com/techcorp",
  },
  {
    name: "EventPro Solutions",
    tier: "gold",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=EP",
    description: "Professional event management and planning services",
    website: "https://example.com/eventpro",
  },
  {
    name: "Digital Dynamics",
    tier: "gold",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=DD",
    description: "Digital transformation and event technology specialists",
    website: "https://example.com/digitaldynamics",
  },
  {
    name: "Innovate Systems",
    tier: "silver",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=IS",
    description: "Innovative software solutions for modern events",
    website: "https://example.com/innovate",
  },
  {
    name: "EventTech Solutions",
    tier: "bronze",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=ET",
    description: "Cutting-edge event technology provider",
    website: "https://example.com/eventtech",
  },
];

const SponsorShowcase = ({
  sponsors = defaultSponsors,
}: SponsorShowcaseProps) => {
  const tiers = ["all", "platinum", "gold", "silver", "bronze"] as const;

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Nossos Patrocinadores
        </h2>

        <Tabs defaultValue="all" className="w-full max-w-2xl">
          <TabsList className="mb-4 flex-wrap justify-center gap-2">
            {tiers.map((tier) => (
              <TabsTrigger key={tier} value={tier} className="capitalize">
                {tier}
              </TabsTrigger>
            ))}
          </TabsList>

          {tiers.map((tier) => (
            <TabsContent key={tier} value={tier}>
              <ScrollArea className="w-full pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                  {sponsors
                    .filter((sponsor) =>
                      tier === "all" ? true : sponsor.tier === tier,
                    )
                    .map((sponsor, index) => (
                      <SponsorCard
                        key={index}
                        name={sponsor.name}
                        tier={sponsor.tier}
                        logo={sponsor.logo}
                        description={sponsor.description}
                        website={sponsor.website}
                      />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default SponsorShowcase;
