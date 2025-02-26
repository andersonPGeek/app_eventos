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
  tier?: string;
  logo?: string;
  description?: string;
  website?: string;
}

const tierColors: Record<string, string> = {
  "Ouro": "bg-yellow-200 hover:bg-yellow-300",
  "Prata": "bg-gray-200 hover:bg-gray-300",
  "Bronze": "bg-amber-600 hover:bg-amber-700",
  "all": "bg-blue-100 hover:bg-blue-200"
};

const SponsorCard = ({
  name = "Acme Corporation",
  tier = "Ouro",
  logo = "https://api.dicebear.com/7.x/initials/svg?seed=AC",
  description = "Leading provider of innovative solutions for the modern enterprise.",
  website = "https://example.com",
}: SponsorCardProps) => {
  return (
    <Card className="w-full max-w-[300px] bg-white hover:shadow-lg transition-shadow">
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
            className={`${tierColors[tier] || 'bg-gray-100'} text-black capitalize transition-colors`}
          >
            {tier}
          </Badge>
        </div>
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
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
