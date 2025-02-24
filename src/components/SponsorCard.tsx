import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";

interface SponsorCardProps {
  name?: string;
  tier?: "platinum" | "gold" | "silver" | "bronze";
  logo?: string;
  description?: string;
  website?: string;
}

const tierColors = {
  platinum: "bg-zinc-300",
  gold: "bg-yellow-200",
  silver: "bg-gray-200",
  bronze: "bg-amber-600",
};

const SponsorCard = ({
  name = "Acme Corporation",
  tier = "gold",
  logo = "https://api.dicebear.com/7.x/initials/svg?seed=AC",
  description = "Leading provider of innovative solutions for the modern enterprise.",
  website = "https://example.com",
}: SponsorCardProps) => {
  return (
    <Card className="w-full max-w-[300px] h-[200px] bg-white hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12">
            <img
              src={logo}
              alt={`${name} logo`}
              className="w-full h-full object-contain"
            />
          </div>
          <Badge
            variant="secondary"
            className={`${tierColors[tier]} text-black capitalize`}
          >
            {tier}
          </Badge>
        </div>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open(website, "_blank")}
        >
          Visitar Site
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SponsorCard;
