
import { Users, Trophy, Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteImages } from '@/hooks/useSiteImages';
import burgerImage from '../assets/burger.jpg'; // Fallback image

const About = () => {
  const navigate = useNavigate();
  const { getImageUrl, saveImage, loading, imagesObject } = useSiteImages();
  const [gastronomyImage, setGastronomyImage] = useState<string | null>(null);
  
  // Carrega a imagem da seção de gastronomia do Supabase
  useEffect(() => {
    console.log('About - Verificando imagesObject:', imagesObject);
    
    // Verificar se temos a imagem de gastronomia no objeto imagesObject
    if (imagesObject && 'gastronomy_image' in imagesObject && imagesObject.gastronomy_image) {
      console.log('About - Imagem de gastronomia encontrada:', imagesObject.gastronomy_image);
      setGastronomyImage(imagesObject.gastronomy_image);
    } else {
      console.log('About - Imagem de gastronomia não encontrada no imagesObject');
      // Tentar obter a imagem usando getImageUrl
      const gastroUrl = getImageUrl('gastronomy_image', '');
      if (gastroUrl) {
        console.log('About - Imagem de gastronomia obtida via getImageUrl:', gastroUrl);
        setGastronomyImage(gastroUrl);
      } else {
        console.log('About - Usando imagem fallback para gastronomia');
        // Manter o fallback para a imagem local
        setGastronomyImage(null);
      }
    }
  }, [imagesObject, getImageUrl]);
  
  // Função para lidar com o clique no card de gastronomia
  const handleFoodCardClick = () => {
    navigate('/menu');
  };

  // Imagem do hambúrguer importada diretamente dos assets
  // Isso garante que a imagem será empacotada com o código durante o build
  const features = [
    {
      icon: Trophy,
      title: "Clube Online Suprema",
      description: "Faça parte do nosso clube online no Suprema - ID 44357. Entre no app Suprema, insira o ID e jogue conosco!",
      image: "/lovable-uploads/a51d0bdb-8cb1-4dcb-80a0-90df1afb8b1b.png",
      whatsapp: "67992488800"
    },
    {
      icon: Users,
      title: "Ambiente Familiar",
      description: "Um espaço acolhedor onde toda a família se sente bem-vinda",
      image: "/lovable-uploads/db9017d8-ede2-437f-add1-7e81ad0032c9.png"
    },
    {
      icon: Utensils,
      title: "Gastronomia Premium",
      description: "Cardápio especial que eleva sua experiência gastronômica",
      link: "/menu"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-gray-dark via-green-black to-green-gray-dark relative">
      {/* Efeitos decorativos */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-primary/5 via-transparent to-green-primary/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Mais que poker
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Uma experiência completa que une estratégia, gastronomia e convivência familiar
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card de Gastronomia Premium - tratado separadamente */}
          <div
            className="group relative overflow-hidden rounded-2xl bg-green-gray-medium/50 backdrop-blur-sm border border-green-primary/20 hover:border-green-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-primary/20 animate-slide-in-left cursor-pointer"
            style={{ animationDelay: '0.1s' }}
            onClick={() => window.open('/menu', '_blank')}
            role="button"
            aria-label="Abrir cardápio"
          >
            {/* Imagem de fundo */}
            <div className="absolute inset-0 opacity-70 group-hover:opacity-80 transition-opacity duration-500">
              <img 
                src={gastronomyImage || burgerImage} 
                alt="Hambúrguer premium com batata frita" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  console.error('Erro ao carregar imagem de gastronomia:', gastronomyImage);
                  // Primeiro tentar o fallback local
                  e.currentTarget.src = burgerImage;
                  // Se ainda falhar, usar um placeholder confiável
                  e.currentTarget.onerror = () => {
                    console.error('Erro ao carregar imagem de fallback local');
                    e.currentTarget.src = 'https://placehold.co/600x400/222222/22c55e?text=Gastronomia';
                    e.currentTarget.onerror = null; // Evitar loops infinitos
                  };
                }}
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-black/90 via-green-black/60 to-green-black/30"></div>
            
            {/* Conteúdo */}
            <div className="relative z-10 p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-primary/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-primary/30 group-hover:scale-110 transition-all duration-300">
                <Utensils className="w-8 h-8 text-green-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-green-primary group-hover:text-green-light transition-colors duration-300">
                Gastronomia Premium
              </h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                Cardápio especial que eleva sua experiência gastronômica
              </p>
              <div className="mt-4">
                <button 
                  onClick={() => window.open('/menu', '_self')}
                  className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-primary/30 transform"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Utensils className="w-5 h-5" />
                    <span className="text-lg">Ver Cardápio</span>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Efeito hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          {/* Demais cards - exceto o de gastronomia */}
          {features.filter(f => f.title !== "Gastronomia Premium").map((feature, index) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl bg-green-gray-medium/50 backdrop-blur-sm border border-green-primary/20 hover:border-green-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-primary/20 animate-slide-in-left cursor-pointer"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Imagem de fundo */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-black/90 via-green-black/60 to-green-black/30"></div>
              
              {/* Conteúdo */}
              <div className="relative z-10 p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-green-primary/30 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-primary/50 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-green-primary/20">
                  <feature.icon className="w-10 h-10 text-green-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-3xl font-bold text-green-primary group-hover:text-green-light transition-colors duration-300">
                  {feature.title}
                </h3>
                
                {/* ID do Clube com destaque */}
                <div className="bg-gradient-to-r from-green-primary/20 to-transparent p-4 rounded-xl border border-green-primary/30 group-hover:border-green-primary/50 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-gray-300 text-sm">ID DO CLUBE</span>
                    <span className="text-green-primary text-3xl font-bold tracking-widest animate-pulse-slow">44357</span>
                  </div>
                </div>
                
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed text-lg">
                  {feature.description}
                </p>
                
                {feature.whatsapp && (
                  <div className="mt-2">
                    <a 
                      href={`https://wa.me/${feature.whatsapp}?text=Ol%C3%A1%2C%20gostaria%20de%20adicionar%20fichas%20no%20clube%20online%20do%20Green%20Table%20Poker%20no%20Suprema.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-primary/30 transform"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                        </svg>
                        <span className="text-lg">Adicionar fichas</span>
                      </div>
                    </a>
                  </div>
                )}
              </div>
              
              {/* Efeito hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
