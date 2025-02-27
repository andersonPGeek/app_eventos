import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ProductCard from "./ProductCard";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Product {
  id: string;
  foto: string;
  nome: string;
  descricao: string;
  link: string;
  valor: number;
  categoria: string;
}

interface MarketplaceProps {
  initialProducts?: Product[];
}

// Função auxiliar para converter URL de webp para jpg
const convertWebpToJpg = (url: string): string => {
  if (url.toLowerCase().endsWith('.webp')) {
    return url.substring(0, url.length - 5) + '.jpg';
  }
  return url;
};

const Marketplace = ({ initialProducts }: MarketplaceProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  //const { items, addItem } = useCart();
  //const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar categorias
        console.log('Buscando categorias de produtos...');
        const categoriasResponse = await fetch(`${API_ENDPOINTS.categoriasProduto}`);
        if (!categoriasResponse.ok) {
          throw new Error(`Erro ao buscar categorias: ${categoriasResponse.status}`);
        }
        const categoriasData = await categoriasResponse.json();
        console.log('Categorias recebidas:', categoriasData);
        
        const categoriasList = ['all', ...categoriasData.map((cat: { categoria: string }) => cat.categoria)];
        setCategories(categoriasList);

        // Buscar produtos
        console.log('Buscando produtos...');
        const produtosResponse = await fetch(`${API_ENDPOINTS.produtos}`);
        if (!produtosResponse.ok) {
          throw new Error(`Erro ao buscar produtos: ${produtosResponse.status}`);
        }
        const produtosData = await produtosResponse.json();
        console.log('Produtos recebidos:', produtosData);
        
        // Converter URLs de imagens webp para jpg
        const produtosConvertidos = produtosData.map((produto: Product) => ({
          ...produto,
          foto: convertWebpToJpg(produto.foto)
        }));
        
        setProducts(produtosConvertidos);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.descricao.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Erro: {error}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
                <SelectValue placeholder="Categoria" />
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
              Nenhum produto encontrado para os critérios selecionados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.nome}
                description={product.descricao}
                price={product.valor}
                imageUrl={product.foto}
                category={product.categoria}
                inStock={true}
                onImageClick={() => navigate(`/product/${product.id}`)}
                onAddToCart={() => {
                  window.open(product.link, "_blank");
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
