import { useState, useRef, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSiteImages } from '@/hooks/useSiteImages';
import { Upload, FileImage, Check, Loader2, RefreshCw, Trash2, X, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type ImageTypeKey = 'hero_background' | 'about_image' | 'contact_background' | 'tournaments_background' | 'menu_background' | 'gastronomy_image';

const imageTypes: { key: ImageTypeKey; label: string }[] = [
  { key: 'hero_background', label: 'Hero Banner' },
  { key: 'about_image', label: 'Sobre' },
  { key: 'contact_background', label: 'Contato' },
  { key: 'tournaments_background', label: 'Torneios' },
  { key: 'menu_background', label: 'Menu' },
  { key: 'gastronomy_image', label: 'Gastronomia' },
];

export const ImagesSection = () => {
  const { images: imagesList, loading, saveImage, uploadImage, deleteImage, fetchImages } = useSiteImages();
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 12;
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageType, setSelectedImageType] = useState<ImageTypeKey | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [heroImageChecking, setHeroImageChecking] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Carregar imagens apenas uma vez ao montar o componente
  useEffect(() => {
    // Carregar imagens inicialmente
    fetchImages();
    
    // Não usar intervalo automático para evitar recarregamentos constantes
    // O usuário pode usar o botão "Recarregar Todas" quando necessário
  }, []);

  // Estado para armazenar URLs de imagens de todas as seções
  const [sectionImageUrls, setSectionImageUrls] = useState<Record<string, string | null>>({});
  const [sectionsChecking, setSectionsChecking] = useState<Record<string, boolean>>({});
  
  // Verificar todas as imagens de seções no banco de dados - apenas uma vez na montagem do componente
  useEffect(() => {
    // Verificar imagens de todas as seções
    const checkAllSectionImages = async () => {
      // Inicializar estado de verificação para todas as seções
      const initialCheckingState: Record<string, boolean> = {};
      imageTypes.forEach(type => {
        initialCheckingState[type.key] = true;
      });
      setSectionsChecking(initialCheckingState);
      
      try {
        // Buscar todas as imagens de seções de uma vez só
        const { data, error } = await supabase
          .from('site_content')
          .select('title, content')
          .eq('type', 'site_image');
          
        if (error) {
          console.error('Erro ao verificar imagens das seções:', error);
          return;
        }
        
        // Mapear resultados para o estado
        const imageUrls: Record<string, string | null> = {};
        if (data) {
          data.forEach(item => {
            if (item.title && item.content) {
              imageUrls[item.title] = item.content;
              console.log(`Imagem de ${item.title} encontrada:`, item.content);
            }
          });
        }
        
        // Atualizar estado com as URLs encontradas
        setSectionImageUrls(imageUrls);
        
        // Atualizar estado do Hero para compatibilidade
        if (imageUrls['hero_background']) {
          setHeroImageUrl(imageUrls['hero_background']);
        }
        
        // Buscar imagens apenas uma vez durante a inicialização
        // Não chamar fetchImages() novamente para evitar loops
      } catch (err) {
        console.error('Erro ao verificar imagens das seções:', err);
      } finally {
        // Marcar todas as seções como verificadas
        const finishedCheckingState: Record<string, boolean> = {};
        imageTypes.forEach(type => {
          finishedCheckingState[type.key] = false;
        });
        setSectionsChecking(finishedCheckingState);
        setHeroImageChecking(false);
      }
    };
    
    checkAllSectionImages();
  }, []);
  
  // Bloco de imagens ativas por seção
  const sectionImages = useMemo(() => {
    return imageTypes.map(type => {
      const img = imagesList.find(img => img.type === type.key);
      // Usar refreshKey em vez de Date.now() para evitar recarregamentos constantes
      const imageUrl = img?.image_url ? `${img.image_url}` : null;
      return {
        ...type,
        image_url: imageUrl
      };
    });
  }, [imagesList, refreshKey]);

  const availableImages = useMemo(() => (
    Array.from(new Set(imagesList.map(img => img.image_url).filter(Boolean)))
  ), [imagesList]);

  const filteredImages = useMemo(() => (
    availableImages.filter(url =>
      url && url.startsWith('http') && url.toLowerCase().includes(search.toLowerCase())
    )
  ), [availableImages, search]);

  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  const currentImages = filteredImages.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadImage(file);
      toast.success('Imagem enviada!');
      fetchImages();
    } catch {
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedImage || !selectedImageType) return;
    setSaving(true);
    try {
      // Verificar se a URL da imagem é válida
      if (!selectedImage.startsWith('http')) {
        toast.error('URL da imagem inválida');
        setSaving(false);
        return;
      }

      console.log(`Aplicando imagem ${selectedImage} à seção ${selectedImageType}`);

      // Fazer uma consulta direta ao banco para verificar se já existe um registro
      const { data: existingData, error: queryError } = await supabase
        .from('site_content')
        .select('*')
        .eq('type', 'site_image')
        .eq('title', selectedImageType)
        .maybeSingle();

      if (queryError) {
        console.error('Erro ao verificar registro existente:', queryError);
        toast.error('Erro ao verificar registro existente');
        setSaving(false);
        return;
      }

      let result;
      // Atualizar ou inserir o registro diretamente
      if (existingData) {
        console.log('Atualizando registro existente:', existingData.id);
        // Atualizar registro existente
        result = await supabase
          .from('site_content')
          .update({
            content: selectedImage,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id)
          .select()
          .single();
      } else {
        console.log('Criando novo registro para', selectedImageType);
        // Inserir novo registro
        result = await supabase
          .from('site_content')
          .insert([{
            type: 'site_image',
            title: selectedImageType,
            content: selectedImage
          }])
          .select()
          .single();
      }

      if (result.error) {
        console.error('Erro ao salvar imagem:', result.error);
        toast.error('Erro ao salvar imagem');
        return;
      }

      console.log('Imagem salva com sucesso:', result.data);
      toast.success(`Imagem aplicada à seção ${imageTypes.find(t => t.key === selectedImageType)?.label || selectedImageType}`);
      
      // Forçar atualização das imagens
      await fetchImages();
      
      // Atualizar o refreshKey para forçar a renderização das imagens
      setRefreshKey(Date.now());
      
          // Forçar atualização imediata das imagens
      await fetchImages();
      
      // Forçar nova renderização
      setRefreshKey(Date.now());
      
      // Limpar seleção
      setSelectedImage(null);
      setSelectedImageType(null);
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      toast.error('Erro ao salvar imagem');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (url: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta imagem?')) return;
    try {
      // Limpar a URL de parâmetros de query para garantir correspondência exata
      const cleanUrl = url.split('?')[0];
      
      // Encontrar a imagem completa pelo URL
      const imageToDelete = imagesList.find(img => {
        const cleanImgUrl = img.image_url?.split('?')[0] || '';
        return cleanImgUrl === cleanUrl;
      });

      // Remover referência da imagem em todas as seções, se estiver em uso
      for (const type of imageTypes) {
        const sectionImage = imagesList.find(img => {
          const cleanImgUrl = img.image_url?.split('?')[0] || '';
          return img.type === type.key && cleanImgUrl === cleanUrl;
        });
        
        if (sectionImage) {
          console.log(`Removendo referência da imagem na seção ${type.key}`);
          await saveImage(type.key, null); // Remove referência
        }
      }

      if (!imageToDelete) {
        // Se não encontrar a imagem na lista, criar um objeto temporário
        const tempImage = {
          id: `temp-${Date.now()}`,
          type: 'gallery_image',
          title: 'Imagem da galeria',
          image_url: cleanUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await deleteImage(tempImage);
      } else {
        await deleteImage(imageToDelete);
      }

      toast.success('Imagem deletada!');
      // Atualizar a lista de imagens e o refreshKey para forçar atualização da UI
      await fetchImages();
      setRefreshKey(Date.now());
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      toast.error('Erro ao deletar imagem');
    }
  };

  const handleSaveSectionImage = async (type: ImageTypeKey, url: string) => {
    setSaving(true);
    try {
      await saveImage(type, url);
      toast.success(`Imagem definida para ${imageTypes.find(t => t.key === type)?.label || type}`);
      fetchImages();
      setSelectedImage(null);
      setSelectedImageType(null);
    } catch {
      toast.error('Erro ao salvar imagem');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewDialogOpen(true);
  };

  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Gerenciar Imagens do Site</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Buscar imagens..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-64"
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Enviando...' : 'Upload'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
          <div className="flex justify-end mb-4 gap-2">
              <Button variant="outline" onClick={async () => {
                // Verificar todas as imagens de seções
                const initialCheckingState: Record<string, boolean> = {};
                imageTypes.forEach(type => {
                  initialCheckingState[type.key] = true;
                });
                setSectionsChecking(initialCheckingState);
                setHeroImageChecking(true);
                
                try {
                  // Buscar todas as imagens de seções de uma vez só
                  const { data, error } = await supabase
                    .from('site_content')
                    .select('title, content')
                    .eq('type', 'site_image');
                    
                  if (error) {
                    console.error('Erro ao verificar imagens das seções:', error);
                    return;
                  }
                  
                  // Mapear resultados para o estado
                  const imageUrls: Record<string, string | null> = {};
                  if (data) {
                    data.forEach(item => {
                      if (item.title && item.content) {
                        imageUrls[item.title] = item.content;
                      }
                    });
                  }
                  
                  // Atualizar estado com as URLs encontradas
                  setSectionImageUrls(imageUrls);
                  
                  // Atualizar estado do Hero para compatibilidade
                  if (imageUrls['hero_background']) {
                    setHeroImageUrl(imageUrls['hero_background']);
                  }
                  
                  toast.success('Todas as imagens verificadas!');
                  // Atualizar refreshKey apenas quando o usuário explicitamente solicitar
                  setRefreshKey(Date.now());
                } catch (err) {
                  console.error('Erro ao verificar imagens:', err);
                  toast.error('Erro ao verificar imagens');
                } finally {
                  // Marcar todas as seções como verificadas
                  const finishedCheckingState: Record<string, boolean> = {};
                  imageTypes.forEach(type => {
                    finishedCheckingState[type.key] = false;
                  });
                  setSectionsChecking(finishedCheckingState);
                  setHeroImageChecking(false);
                }
              }} disabled={Object.values(sectionsChecking).some(checking => checking) || heroImageChecking}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Verificar Todas
              </Button>
              
              <Button variant="outline" onClick={async () => {
                try {
                  await fetchImages();
                  // Atualizar refreshKey apenas quando o usuário explicitamente solicitar
                  setRefreshKey(Date.now());
                  toast.success('Imagens recarregadas!');
                } catch (error) {
                  console.error('Erro ao recarregar imagens:', error);
                  toast.error('Erro ao recarregar imagens');
                }
              }} disabled={loading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Recarregar Todas
              </Button>
            </div>
        </CardContent>
        
        {/* Seções de imagens do site */}
        <CardContent>
            {!loading && (
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sectionImages.map(section => (
                  <div key={section.key} className={`flex items-center gap-4 ${section.image_url || sectionImageUrls[section.key] ? 'bg-green-950/40 border-2 border-green-500/50 shadow-lg shadow-green-500/20' : 'bg-black/40 border border-green-700/30'} rounded p-3 relative`}>
                    {(section.image_url || sectionImageUrls[section.key]) && (
                      <div className="absolute -top-3 -right-2 bg-green-600 text-white text-xs rounded-md px-2 py-1 font-medium">
                        Ativo
                      </div>
                    )}
                    <div className="w-16 h-16 flex items-center justify-center bg-black/60 rounded relative">
                      {section.image_url ? (
                        <>
                          <img 
                            src={`${section.image_url}`} 
                            alt={section.label} 
                            className="w-16 h-16 object-cover rounded" 
                            onError={(e) => {
                              console.log('Erro ao carregar imagem:', e);
                              // Tentar recarregar com nova URL
                              const target = e.target as HTMLImageElement;
                              target.src = `${section.image_url}&retry=${Date.now()}`;
                            }}
                          />
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full p-1">
                            <Check size={12} />
                          </div>
                        </>
                      ) : sectionsChecking[section.key] ? (
                        // Verificando imagem da seção
                        <div className="flex flex-col items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin text-green-500 mb-1" />
                          <span className="text-xs text-green-400">Verificando...</span>
                        </div>
                      ) : sectionImageUrls[section.key] ? (
                        // Imagem encontrada no banco mas não no estado local
                        <>
                          <img 
                            src={`${sectionImageUrls[section.key]}`} 
                            alt={section.label} 
                            className="w-16 h-16 object-cover rounded" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `${sectionImageUrls[section.key]}?retry=${Date.now()}`;
                            }}
                          />
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full p-1">
                            <Check size={12} />
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">Sem imagem</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-green-300 font-semibold text-sm mb-1">{section.label}</div>
                      {section.image_url && (
                        <a href={section.image_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 underline">Ver imagem</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Estado de carregamento */}
            {loading ? (
              <div className="py-8 text-center text-gray-400">
                <Loader2 className="w-12 h-12 mx-auto animate-spin" />
                <p>Carregando imagens...</p>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <FileImage className="w-12 h-12 mx-auto mb-2" />
                <p>Nenhuma imagem encontrada</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentImages.map(url => {
                  const isHero = imagesList.some(img => img.type === 'hero_background' && img.image_url === url);
                  return (
                    <div key={url} className={`relative border rounded p-2 group ${selectedImage === url ? 'ring-4 ring-blue-500 border-blue-500' : ''} ${isHero ? 'ring-2 ring-green-500 border-green-500' : 'bg-black/30'}`}>
                      <img
                        src={`${url}?t=${refreshKey}`}
                        alt="Imagem"
                        className="w-full h-32 object-cover rounded cursor-pointer transition-all hover:opacity-90"
                        onClick={() => {
                          setSelectedImage(url);
                        }}
                        onError={(e) => {
                          console.log('Erro ao carregar imagem da galeria:', e);
                          // Tentar recarregar com nova URL
                          const target = e.target as HTMLImageElement;
                          target.src = `${url}?retry=${Date.now()}`;
                        }}
                      />
                      {isHero && (
                        <span className="absolute top-2 left-2 bg-green-700 text-white text-xs px-2 py-0.5 rounded shadow">Hero</span>
                      )}
                      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button size="icon" variant="ghost" onClick={() => handlePreview(url)} className="bg-black/50 hover:bg-black/70">
                          <Eye className="w-4 h-4 text-white" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(url)} className="bg-black/50 hover:bg-black/70">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <Button size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  size="sm"
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Próxima</Button>
            </div>
          )}
          {/* Aplicar imagem */}
          {selectedImage && (
            <div className="mt-6 p-4 bg-black/40 rounded border border-green-500/30">
              <h3 className="text-lg font-medium mb-3 text-green-400 flex items-center">
                <FileImage className="w-5 h-5 mr-2" />
                Aplicar imagem à seção do site
              </h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="text-sm text-gray-400 mb-1">Imagem selecionada:</div>
                  <img 
                    src={selectedImage} 
                    alt="Selecionada" 
                    className="w-full max-w-xs h-40 object-cover rounded border border-gray-700" 
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="text-sm text-gray-400 mb-1">Escolha onde aplicar esta imagem:</div>
                  <Select 
                    value={selectedImageType ?? undefined} 
                    onValueChange={v => setSelectedImageType(v as ImageTypeKey)}
                  >
                    <SelectTrigger className="w-full mb-4">
                      <SelectValue placeholder="Selecione a seção do site" />
                    </SelectTrigger>
                    <SelectContent>
                      {imageTypes.map(type => (
                        <SelectItem key={type.key} value={type.key}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-2 mt-auto">
                    <Button 
                      className="flex-1" 
                      onClick={handleSave} 
                      disabled={!selectedImageType || saving}
                      variant="default"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                      Aplicar imagem
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedImage(null)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Prévia */}
          <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Prévia da Imagem</DialogTitle>
              </DialogHeader>
              {previewImage && (
                <img src={previewImage} alt="Prévia" className="w-full max-h-[60vh] object-contain" />
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente já exportado como exportação nomeada