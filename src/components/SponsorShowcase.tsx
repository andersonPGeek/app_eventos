import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import SponsorCard from "./SponsorCard";

interface CategoriaPatrocinio {
  Tipo: string;
  id: string;
}

interface Empresa {
  categoriaPatrocinio: string;
  logo: string;
  nomeEmpresa: string;
  segmento: string;
  site: string;
}

interface Sponsor {
  name: string;
  tier: string;
  logo: string;
  description: string;
  website: string;
}

interface SponsorShowcaseProps {
  sponsors?: Sponsor[];
}

const SponsorShowcase = ({ sponsors }: SponsorShowcaseProps) => {
  const [categorias, setCategorias] = useState<string[]>(['all']);
  const [sponsorsList, setSponsorsList] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Iniciando busca de dados...');
        
        // Buscar categorias de patrocínio
        console.log('Buscando categorias de patrocínio...');
        const categoriasResponse = await fetch('http://localhost:3000/api/categorias-patrocinio');
        if (!categoriasResponse.ok) {
          throw new Error(`Erro ao buscar categorias: ${categoriasResponse.status}`);
        }
        const categoriasData = await categoriasResponse.json();
        console.log('Categorias recebidas:', categoriasData);
        
        if (!Array.isArray(categoriasData)) {
          throw new Error('Dados de categorias inválidos: não é um array');
        }
        
        const tiposPatrocinio = ['all', ...categoriasData.map((cat: CategoriaPatrocinio) => cat.Tipo)];
        console.log('Tipos de patrocínio processados:', tiposPatrocinio);
        setCategorias(tiposPatrocinio);

        // Buscar empresas
        console.log('Buscando empresas...');
        const empresasResponse = await fetch('http://localhost:3000/api/empresas');
        if (!empresasResponse.ok) {
          throw new Error(`Erro ao buscar empresas: ${empresasResponse.status}`);
        }
        const empresasData = await empresasResponse.json();
        console.log('Empresas recebidas:', empresasData);
        
        if (!Array.isArray(empresasData)) {
          throw new Error('Dados de empresas inválidos: não é um array');
        }

        // Mapear empresas para o formato do Sponsor
        const mappedSponsors: Sponsor[] = empresasData.map((empresa: Empresa) => {
          console.log('Processando empresa:', empresa);
          return {
            name: empresa.nomeEmpresa,
            tier: empresa.categoriaPatrocinio,
            logo: empresa.logo,
            description: empresa.segmento,
            website: empresa.site
          };
        });

        console.log('Sponsors mapeados:', mappedSponsors);
        setSponsorsList(mappedSponsors);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">Erro: {error}</div>;
  }

  if (loading) {
    return <div className="text-center p-4">Carregando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Nossos Patrocinadores
        </h2>

        <Tabs defaultValue="all" className="w-full max-w-2xl">
          <TabsList className="mb-4 flex-wrap justify-center gap-2">
            {categorias.map((tier) => (
              <TabsTrigger key={tier} value={tier} className="capitalize">
                {tier}
              </TabsTrigger>
            ))}
          </TabsList>

          {categorias.map((tier) => (
            <TabsContent key={tier} value={tier}>
              <ScrollArea className="w-full pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                  {sponsorsList.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">
                      Nenhum patrocinador encontrado
                    </div>
                  ) : (
                    sponsorsList
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
                      ))
                  )}
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
