import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hsubouwujfcdyuyikvbi.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LeadsAdminSection() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setLeads(data || []);
      setLoading(false);
    };
    fetchLeads();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Leads Cadastrados</h2>
      {loading ? <p>Carregando...</p> : error ? <p className="text-red-600">Erro: {error}</p> : (
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Nome</th>
              <th className="p-2">Email</th>
              <th className="p-2">Telefone</th>
              <th className="p-2">Data de Nascimento</th>
              <th className="p-2">Cadastrado em</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} className="border-t">
                <td className="p-2">{lead.nome}</td>
                <td className="p-2">{lead.email}</td>
                <td className="p-2">{lead.telefone}</td>
                <td className="p-2">{lead.data_nascimento}</td>
                <td className="p-2">{new Date(lead.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
