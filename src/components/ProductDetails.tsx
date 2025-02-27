import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";

interface Product {
  id: string;
  foto: string;
  nome: string;
  descricao: string;
  link: string;
  valor: number;
  categoria: string;
}

// Função auxiliar para converter URL de webp para jpg
const convertWebpToJpg = (url: string): string => {
  if (url.toLowerCase().endsWith('.webp')) {
    return url.substring(0, url.length - 5) + '.jpg';
  }
  return url;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_ENDPOINTS.produtos}/${id}`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar produto: ${response.status}`);
        }
        const data = await response.json();
        
        // Converter URL da imagem de webp para jpg
        const produtoConvertido = {
          ...data,
          foto: convertWebpToJpg(data.foto)
        };
        
        setProduct(produtoConvertido);
      } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Carregando detalhes do produto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Erro: {error}</div>;
  }

  if (!product) {
    return <div className="text-center p-4">Produto não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div className="relative aspect-square">
              <img
                src={product.foto}
                alt={product.nome}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{product.nome}</h1>
                <p className="text-gray-600">{product.descricao}</p>
              </div>

              <div>
                <span className="text-lg font-semibold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(product.valor)}
                </span>
              </div>

              <div>
                <span className="inline-block bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm">
                  {product.categoria}
                </span>
              </div>

              <Button
                className="w-full"
                onClick={() => window.open(product.link, "_blank")}
              >
                Eu quero
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
