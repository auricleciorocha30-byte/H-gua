
import React from 'react';
import { Search, UserPlus, Phone, MapPin, MoreVertical, MessageSquare, X, Edit2, Trash2 } from 'lucide-react';
import { Client, ClientType } from '../types';

interface ClientsProps {
  clients: Client[];
  onAddClient: (client: Partial<Client>) => void;
  onUpdateClient: (client: Client) => void;
  onRemoveClient: (id: string) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients, onAddClient, onUpdateClient, onRemoveClient }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<Partial<Client>>({
    name: '',
    phone: '',
    address: '',
    type: ClientType.RESIDENTIAL
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (formData.id) {
      onUpdateClient(formData as Client);
    } else {
      onAddClient(formData);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', address: '', type: ClientType.RESIDENTIAL });
  };

  const handleEdit = (client: Client) => {
    setFormData(client);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este cliente?')) {
      onRemoveClient(id);
    }
    setActiveMenuId(null);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar nome ou telefone..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none shadow-sm transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100 font-semibold text-sm"
        >
          <UserPlus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-110 transition-transform ${client.type === ClientType.COMMERCIAL ? 'bg-blue-500' : 'bg-green-500'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-bold border border-gray-100 uppercase">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{client.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${client.type === ClientType.COMMERCIAL ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    {client.type === ClientType.COMMERCIAL ? 'Comercial' : 'Residencial'}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === client.id ? null : client.id); }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
                
                {activeMenuId === client.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                    <button 
                      onClick={() => handleEdit(client)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Edit2 size={16} /> Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(client.id)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} /> Remover
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone size={16} className="text-gray-400" />
                {client.phone || 'Sem telefone'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} className="text-gray-400" />
                <span className="truncate">{client.address || 'Sem endereço'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-400">
                <span className="font-bold text-gray-700">{client.purchaseCount}</span> compras realizadas
              </div>
              <div className="flex gap-2">
                <button 
                    onClick={() => window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}`, '_blank')}
                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <MessageSquare size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-red-600 p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold">{formData.id ? 'Editar Cliente' : 'Cadastrar Cliente'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-red-500 p-1 rounded-full transition-colors">
                <X />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
                  placeholder="Ex: João Silva"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">WhatsApp / Telefone</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
                  placeholder="85 9..."
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Endereço</label>
                <textarea 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium min-h-[80px]"
                  placeholder="Rua, número, bairro..."
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tipo de Cliente</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: ClientType.RESIDENTIAL})}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${formData.type === ClientType.RESIDENTIAL ? 'bg-red-50 border-red-500 text-red-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                  >
                    Residencial
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: ClientType.COMMERCIAL})}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${formData.type === ClientType.COMMERCIAL ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                  >
                    Comercial
                  </button>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all mt-4"
              >
                {formData.id ? 'Salvar Alterações' : 'Salvar Cliente'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
