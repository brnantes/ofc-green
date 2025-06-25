import { MapPin, Phone, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import { useState, useEffect } from 'react';

const Footer = () => {
  const [footerData, setFooterData] = useState({
    endereco: '',
    telefone: '',
    whatsappTexto: '',
    whatsappLink: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('footerData');
    if (saved) {
      setFooterData(JSON.parse(saved));
    }
    // Listener para atualizar quando outro componente alterar o localStorage
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'footerData') {
        setFooterData(event.newValue ? JSON.parse(event.newValue) : {
          endereco: '', telefone: '', whatsappTexto: '', whatsappLink: ''
        });
      }
    };
    window.addEventListener('storage', handleStorage);
    // Atualização imediata na mesma aba
    window.addEventListener('footerDataUpdate', () => {
      const updated = localStorage.getItem('footerData');
      setFooterData(updated ? JSON.parse(updated) : {
        endereco: '', telefone: '', whatsappTexto: '', whatsappLink: ''
      });
    });
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('footerDataUpdate', () => {});
    };
  }, []);

  return (
    <footer className="bg-green-black border-t border-green-primary/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/green-table-logo.png" 
                alt="Green Table Logo" 
                className="w-12 h-12 mr-3"
              />
              <h3 className="text-2xl font-bold gradient-text">
                Green Table
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              Mais que um clube, uma família unida pela paixão pelo pôquer e boa convivência.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-green-primary hover:text-green-light transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-green-primary hover:text-green-light transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-green-primary hover:text-green-light transition-colors">
                <Youtube size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-green-primary font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#tournaments" className="text-gray-400 hover:text-green-primary transition-colors">Torneios</a></li>
              <li><a href="#hall-of-fame" className="text-gray-400 hover:text-green-primary transition-colors">Hall da Fama</a></li>
              <li><a href="/menu" className="text-gray-400 hover:text-green-primary transition-colors">Cardápio</a></li>
              <li><Link to="/login" className="text-xs text-gray-400 hover:text-gray-300 transition-colors">Painel Admin</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-green-primary font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <MapPin size={16} className="mr-2 text-green-primary" />
                <span>{footerData.endereco || 'Rua do Pôquer, 123 - Centro'}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone size={16} className="mr-2 text-green-primary" />
                <span>{footerData.telefone || '(11) 9999-8888'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-green-primary font-semibold mb-4">WhatsApp</h4>
            <p className="text-gray-400 mb-4">
              {footerData.whatsappTexto || 'Fale conosco diretamente pelo WhatsApp'}
            </p>
            <a
              href={
                footerData.whatsappLink
                  ? footerData.whatsappLink.startsWith('http')
                    ? footerData.whatsappLink
                    : footerData.whatsappLink.replace(/^(wa\.me\/|https:\/\/wa\.me\/)?/, 'https://wa.me/')
                  : 'https://wa.me/551199998888'
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Chamar no WhatsApp
              </Button>
            </a>
          </div>
        </div>
        
        <div className="border-t border-green-primary/20 mt-8 pt-8 text-center flex flex-col items-center gap-2">
          <img 
            src="/lovable-uploads/green-table-logo.png" 
            alt="Green Table Logo" 
            className="h-10 w-auto mx-auto mb-2"
          />
          <p className="text-gray-400">
            © 2025 Green Table. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
