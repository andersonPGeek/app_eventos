import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ProductCard from "./ProductCard";
import { Search, Filter, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface MarketplaceProps {
  products?: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    inStock: boolean;
  }>;
}

const defaultProducts = [
  {
    id: "1",
    title: "Event T-Shirt",
    description:
      "Official conference merchandise - 100% cotton, available in multiple sizes",
    price: 29.99,
    imageUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop",
    category: "Merchandise",
    inStock: true,
  },
  {
    id: "2",
    title: "Conference Hoodie",
    description: "Stay warm and stylish with our premium conference hoodie",
    price: 49.99,
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop",
    category: "Merchandise",
    inStock: true,
  },
  {
    id: "3",
    title: "Digital Conference Pass",
    description: "Access to all virtual sessions and workshops",
    price: 199.99,
    imageUrl:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&h=400&fit=crop",
    category: "Digital",
    inStock: true,
  },
  {
    id: "4",
    title: "VIP Experience Package",
    description: "Exclusive access to special events and networking sessions",
    price: 299.99,
    imageUrl:
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=300&h=400&fit=crop",
    category: "Experiences",
    inStock: false,
  },
];

const Marketplace = ({ products = defaultProducts }: MarketplaceProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { items, addItem } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">Loja do Evento</h2>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No products found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                description={product.description}
                price={product.price}
                imageUrl={product.imageUrl}
                category={product.category}
                inStock={product.inStock}
                onImageClick={() => navigate(`/product/${product.id}`)}
                onAddToCart={() => {
                  addItem({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    imageUrl: product.imageUrl,
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
