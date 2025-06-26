import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

// Usando o cliente Supabase importado do arquivo de integração

export default function LeadsForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', birth_date: '' });
  const [status, setStatus] = useState('');
  const [showBuyInMessage, setShowBuyInMessage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formatação especial para o campo de telefone
    if (name === 'phone') {
      // Remove todos os caracteres não numéricos
      const numericValue = value.replace(/\D/g, '');
      
      // Aplica a formatação (XX) XXXXX-XXXX
      let formattedValue = numericValue;
      if (numericValue.length <= 11) {
        if (numericValue.length > 2) {
          formattedValue = `(${numericValue.slice(0, 2)})${numericValue.length > 2 ? ' ' + numericValue.slice(2) : ''}`;
        }
        if (numericValue.length > 7) {
          formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
        }
      }
      
      setForm({ ...form, [name]: formattedValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Enviando...');
    
    // Armazenar os dados do cliente na tabela site_content existente
    // Usando o tipo 'client' para diferenciar de outros conteúdos
    const clientData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      birth_date: form.birth_date,
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase.from('site_content').insert([
      {
        type: 'client',
        title: form.name, // Usar o nome como título para facilitar a listagem
        content: JSON.stringify(clientData) // Armazenar os dados como JSON na coluna content
      },
    ]);
    if (error) {
      setStatus('Erro ao enviar: ' + error.message);
    } else {
      setStatus('Enviado com sucesso!');
      setForm({ name: '', email: '', phone: '', birth_date: '' });
      setShowBuyInMessage(true);
      // Scroll para o topo após 2 segundos
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      {/* Banner de promoção removido */}
      
      <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto mt-12">
        {/* Coluna do formulário */}
        <div className="md:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-6 bg-poker-gray-dark border border-poker-gold/30 p-8 rounded-lg shadow-xl relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-poker-gold via-poker-gold-light to-poker-gold"></div>
            
            <h2 className="text-2xl font-bold mb-6 text-poker-white">Ganhe <span className="text-poker-gold">BUY-IN GRÁTIS</span> no seu primeiro torneio!</h2>
            
            <p className="text-sm text-gray-300 mb-6">Cadastre-se agora e garanta sua entrada gratuita em qualquer torneio da casa. Além disso, receba promoções exclusivas e seja o primeiro a saber das novidades.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-poker-white text-sm font-medium mb-1">Nome completo</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-poker-gray-medium border-poker-gold/20 border rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-poker-gold/50 focus:border-transparent transition-all" 
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-poker-white text-sm font-medium mb-1">Email</label>
                <input 
                  name="email" 
                  type="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-poker-gray-medium border-poker-gold/20 border rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-poker-gold/50 focus:border-transparent transition-all" 
                  placeholder="seu.email@exemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-poker-white text-sm font-medium mb-1">Telefone</label>
                <div className="relative">
                  <input 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-poker-gray-medium border-poker-gold/20 border rounded-md px-4 py-3 pl-10 text-white focus:ring-2 focus:ring-poker-gold/50 focus:border-transparent transition-all hover:border-poker-gold/40" 
                    placeholder="(67) 99999-9999"
                    maxLength={15}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-green-primary" viewBox="0 0 16 16">
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-poker-white text-sm font-medium mb-1">Data de Nascimento</label>
                <input 
                  name="birth_date" 
                  type="date" 
                  value={form.birth_date} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-poker-gray-medium border-poker-gold/20 border rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-poker-gold/50 focus:border-transparent transition-all" 
                />
              </div>
            </div>
            
            <div className="pt-2">
              <motion.button 
                type="submit" 
                className="w-full bg-poker-gold hover:bg-poker-gold-light text-poker-black font-bold py-3 px-6 rounded-md shadow-lg transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                GARANTIR MINHA VAGA
              </motion.button>
              
              <p className="text-xs text-center text-gray-400 mt-3">Ao se cadastrar, você concorda com nossos termos e política de privacidade</p>
            </div>
            
            {status && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-md text-center ${status.includes('Erro') ? 'bg-red-900/30 text-red-200' : 'bg-green-900/30 text-green-200'}`}
              >
                {status}
              </motion.div>
            )}
            
            {/* Mensagem de sucesso com gatilho de conversão */}
            {showBuyInMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-poker-gold/20 border border-poker-gold rounded-md text-center"
              >
                <h3 className="text-xl font-bold text-poker-gold mb-2">🎉 Parabéns! 🎉</h3>
                <p className="text-white">Seu buy-in grátis foi reservado! Nossa equipe entrará em contato em breve com mais detalhes.</p>
              </motion.div>
            )}
            
            {/* Selos de confiança */}
            <div className="flex items-center justify-center space-x-4 mt-4 text-gray-400 text-xs">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Dados seguros</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Privacidade garantida</span>
              </div>
            </div>
          </form>
        </div>
        
        {/* Coluna do Instagram */}
        <div className="md:w-1/2">
          <div className="bg-gradient-to-br from-poker-gray-medium to-poker-gray-dark border-poker-gold/30 border-2 rounded-2xl p-8 text-center h-full flex flex-col justify-center shadow-lg shadow-green-primary/10 hover:shadow-green-primary/20 transition-all duration-300 hover:scale-[1.02] transform">
            <div className="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-green-primary mb-2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-green-primary mb-4 text-shadow-sm">Siga nosso Instagram!</h3>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Para novidades, fotos dos eventos e contato direto, siga nosso perfil:
            </p>
            <div className="bg-gradient-to-r from-green-primary/20 to-green-primary/10 p-4 rounded-xl mb-4 hover:from-green-primary/30 hover:to-green-primary/20 transition-all duration-300 cursor-pointer">
              <p className="text-green-primary text-2xl font-bold tracking-wide">
                @greentableclub
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
