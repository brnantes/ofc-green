import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';

const supabaseUrl = 'https://hsubouwujfcdyuyikvbi.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key'; // Substitua pela sua chave pública se necessário
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LeadsForm() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', data_nascimento: '' });
  const [status, setStatus] = useState('');
  const [showBuyInMessage, setShowBuyInMessage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Enviando...');
    const { error } = await supabase.from('leads').insert([
      {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        data_nascimento: form.data_nascimento,
      },
    ]);
    if (error) {
      setStatus('Erro ao enviar: ' + error.message);
    } else {
      setStatus('Enviado com sucesso!');
      setForm({ nome: '', email: '', telefone: '', data_nascimento: '' });
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
      {/* Banner de promoção */}
      <div className="absolute left-0 right-0 bg-poker-gold text-white text-center py-2 px-4 shadow-lg transform -rotate-1 z-10 animate-pulse-slow max-w-5xl mx-auto">
        <span className="font-bold">🎲 OFERTA ESPECIAL 🎲</span>
        <p className="text-sm">Cadastre-se hoje e ganhe um <span className="font-bold text-poker-white">BUY-IN GRÁTIS</span> no seu primeiro torneio!</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto mt-12">
        {/* Coluna do formulário */}
        <div className="md:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-6 bg-poker-gray-dark border border-poker-gold/30 p-8 rounded-lg shadow-xl relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-poker-gold via-poker-gold-light to-poker-gold"></div>
            
            <h2 className="text-2xl font-bold mb-6 text-poker-white">Junte-se à nossa mesa <span className="text-poker-gold">VIP</span></h2>
            
            <p className="text-sm text-gray-300 mb-6">Cadastre-se para receber novidades, promoções exclusivas e garantir sua vaga nos melhores torneios.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-poker-white text-sm font-medium mb-1">Nome completo</label>
                <input 
                  name="nome" 
                  value={form.nome} 
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
                <input 
                  name="telefone" 
                  value={form.telefone} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-poker-gray-medium border-poker-gold/20 border rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-poker-gold/50 focus:border-transparent transition-all" 
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div>
                <label className="block text-poker-white text-sm font-medium mb-1">Data de Nascimento</label>
                <input 
                  name="data_nascimento" 
                  type="date" 
                  value={form.data_nascimento} 
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
          <div className="bg-poker-gray-medium border-poker-gold/20 border rounded-lg p-8 text-center h-full flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-green-primary mb-4">Siga nosso Instagram!</h3>
            <p className="text-gray-300 text-lg mb-8">
              Para novidades, fotos dos eventos e contato direto, siga nosso perfil:
            </p>
            <div className="flex justify-center">
              <a
                href="https://instagram.com/greentableclub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform text-xl"
              >
                @greentableclub
              </a>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-poker-gray-dark rounded-md p-2 aspect-square"></div>
              <div className="bg-poker-gray-dark rounded-md p-2 aspect-square"></div>
              <div className="bg-poker-gray-dark rounded-md p-2 aspect-square"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
