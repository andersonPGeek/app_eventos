import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import PageContainer from "./PageContainer";

interface ProductDetailsProps {
  product?: {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    inStock: boolean;
  };
  onAddToCart?: () => void;
  onBack?: () => void;
}

const defaultProduct = {
  id: "1",
  title: "Event T-Shirt",
  description:
    "Official conference merchandise - 100% cotton, available in multiple sizes",
  price: 29.99,
  imageUrl:
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=600&fit=crop",
  category: "Merchandise",
  inStock: true,
};

const ProductDetails = ({ product = defaultProduct }: ProductDetailsProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    navigate("/cart");
  };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <PageContainer>
      <div className="container mx-auto p-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          ← Voltar
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{product.title}</h1>
              <p className="text-3xl font-bold mt-2">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Descrição</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Categoria</h2>
              <p className="text-muted-foreground capitalize">
                {product.category}
              </p>
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={!product.inStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock
                ? "Adicionar ao Carrinho"
                : "Produto Indisponível"}
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProductDetails;
