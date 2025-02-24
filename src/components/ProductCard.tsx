import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Heart } from "lucide-react";

interface ProductCardProps {
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  inStock?: boolean;
}

const ProductCard = ({
  title = "Event T-Shirt",
  description = "Official conference merchandise - 100% cotton, available in multiple sizes",
  price = 29.99,
  imageUrl = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop",
  category = "Merchandise",
  inStock = true,
}: ProductCardProps) => {
  return (
    <Card className="w-full max-w-[280px] h-[400px] bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <Badge
          className="absolute top-2 right-2"
          variant={inStock ? "default" : "destructive"}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </Badge>
      </div>

      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <Badge variant="secondary" className="mt-1">
              {category}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        <CardDescription className="mt-2 line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-lg font-bold">${price.toFixed(2)}</div>
        <Button className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
