import { createContext, useContext } from 'react';
import { useSiteImages as useSiteImagesData, SiteImage } from '@/hooks/useSiteImages';

interface SiteImagesContextType {
  images: SiteImage[];
  loading: boolean;
  getImageUrl: (imageType: string, fallbackUrl: string) => string;
  saveImage: (imageType: string, imageUrl: string) => Promise<any>;
  uploadImage: (file: File) => Promise<void>;
  deleteImage: (imageUrl: string) => Promise<void>;
  fetchImages: () => Promise<void>;
}

const SiteImagesContext = createContext<SiteImagesContextType | undefined>(undefined);

export const SiteImagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const siteImagesData = useSiteImagesData();
  return (
    <SiteImagesContext.Provider value={siteImagesData}>
      {children}
    </SiteImagesContext.Provider>
  );
};

export const useSharedSiteImages = () => {
  const context = useContext(SiteImagesContext);
  if (context === undefined) {
    throw new Error('useSharedSiteImages must be used within a SiteImagesProvider');
  }
  return context;
};
