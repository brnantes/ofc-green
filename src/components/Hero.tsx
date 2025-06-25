
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSiteImages } from '@/hooks/useSiteImages';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const { images, loading, getImageUrl, fetchImages } = useSiteImages();
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  
  // Forçar atualização periódica da imagem
  useEffect(() => {
    // Função para buscar a imagem do hero diretamente do banco de dados
    const updateHeroImage = async () => {
      console.log('[Hero] Buscando imagem do hero diretamente do banco...');
      try {
        // Buscar diretamente do banco de dados
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('type', 'site_image')
          .eq('title', 'hero_background')
          .maybeSingle();
        
        if (error) {
          console.error('[Hero] Erro ao buscar imagem do hero:', error);
          return;
        }
        
        if (data?.content) {
          // Adicionar timestamp para evitar cache
          const urlWithTimestamp = `${data.content}?t=${Date.now()}`;
          
          // Atualizar o estado
          setHeroImageUrl(urlWithTimestamp);
          console.log('[Hero] Imagem atualizada com sucesso:', urlWithTimestamp);
        } else {
          // Usar imagem padrão se não encontrar no banco
          const defaultUrl = '/lovable-uploads/a51d0bdb-8cb1-4dcb-80a0-90df1afb8b1b.png';
          setHeroImageUrl(`${defaultUrl}?t=${Date.now()}`);
          console.log('[Hero] Usando imagem padrão:', defaultUrl);
        }
      } catch (e) {
        console.error('[Hero] Exceção ao buscar imagem do hero:', e);
      }
    };
    
    // Buscar imagem ao montar o componente
    updateHeroImage();
    
    // Atualizar a cada 3 segundos
    const interval = setInterval(() => {
      updateHeroImage();
      setRefreshKey(Date.now());
    }, 3000);
    
    return () => clearInterval(interval);
  }, [fetchImages, getImageUrl]);
  
  // URL da imagem com fallback
  const imageUrl = heroImageUrl || `/lovable-uploads/a51d0bdb-8cb1-4dcb-80a0-90df1afb8b1b.png?t=${refreshKey}`;

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[70vh] sm:min-h-[80vh] w-full overflow-hidden py-8 sm:py-0">
      {/* Imagem de fundo com overlay */}
      {!loading && (
        <img 
          src={imageUrl} 
          alt="Mesa de Poker Green Table" 
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500" 
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-poker-black/80 via-poker-gray-dark/80 to-poker-black/80"></div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-4 sm:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl xs:text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4 flex flex-col items-center">
          <span>Bem-vindo ao</span>
          <img 
            src="/lovable-uploads/green-table-logo.png"
            alt="Green Table Logo"
            className="h-20 xs:h-28 md:h-32 w-auto mt-2 mb-2 drop-shadow-xl"
          />
        </h1>
        <p className="text-base xs:text-lg md:text-2xl text-white/90 mb-8 max-w-xl sm:max-w-2xl mx-auto">
          O melhor clube de poker e bar da cidade. Experimente a emoção do jogo em um ambiente sofisticado e descontraído.
        </p>
        <a
          href="#torneios"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg shadow-lg transition"
        >
          Ver torneios
        </a>
      </div>
    </section>
  );
};

export default Hero;
