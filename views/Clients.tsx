
import React from 'react';
import { Search, UserPlus, Phone, MapPin, MoreVertical, MessageSquare } from 'lucide-react';
import { Client, ClientType } from '../types';

interface ClientsProps {
  clients: Client[];
  onAddClient: (client: Partial<Client>) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar nome ou telefone..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100 font-semibold">
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
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-bold border border-gray-100">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{client.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${client.type === ClientType.COMMERCIAL ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    {client.type === ClientType.COMMERCIAL ? 'Comercial' : 'Residencial'}
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={20} /></button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone size={16} className="text-gray-400" />
                {client.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} className="text-gray-400" />
                {client.address}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-400">
                <span className="font-bold text-gray-700">{client.purchaseCount}</span> compras realizadas
              </div>
              <div className="flex gap-2">
                <button 
                    onClick={() => window.open(`https://wa.me/${client.phone}`, '_blank')}
                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <MessageSquare size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;
