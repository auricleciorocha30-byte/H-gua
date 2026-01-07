
import React from 'react';
import { Truck, MapPin, CheckCircle, Clock, Navigation, Phone, User, Plus, X, UserCheck, Trash2 } from 'lucide-react';
import { Delivery, DeliveryStatus } from '../types';

interface DeliveriesProps {
  deliveries: Delivery[];
  deliverers: string[];
  onUpdateStatus: (id: string, status: DeliveryStatus, delivererName?: string) => void;
  onAddDeliverer: (name: string) => void;
  onRemoveDeliverer: (name: string) => void;
}

const Deliveries: React.FC<DeliveriesProps> = ({ 
  deliveries, 
  deliverers, 
  onUpdateStatus, 
  onAddDeliverer,
  onRemoveDeliverer 
}) => {
  const [filter, setFilter] = React.useState<DeliveryStatus | 'ALL'>('ALL');
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [isManageDeliverersOpen, setIsManageDeliverersOpen] = React.useState(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = React.useState<string | null>(null);
  const [newDelivererName, setNewDelivererName] = React.useState('');
  const [tempDeliverer, setTempDeliverer] = React.useState('');

  const filtered = deliveries.filter(d => filter === 'ALL' || d.status === filter);

  const getStatusColor = (status: DeliveryStatus) => {
    switch(status) {
        case DeliveryStatus.PENDING: return 'bg-orange-100 text-orange-600';
        case DeliveryStatus.IN_ROUTE: return 'bg-blue-100 text-blue-600';
        case DeliveryStatus.DELIVERED: return 'bg-green-100 text-green-600';
        default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: DeliveryStatus) => {
    switch(status) {
        case DeliveryStatus.PENDING: return 'Pendente';
        case DeliveryStatus.IN_ROUTE: return 'Em Rota';
        case DeliveryStatus.DELIVERED: return 'Entregue';
        default: return 'Cancelado';
    }
  };

  const handleOpenMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleStartDelivery = (id: string) => {
    setSelectedDeliveryId(id);
    setTempDeliverer('');
    setIsAssignModalOpen(true);
  };

  const confirmStartDelivery = () => {
    if (!selectedDeliveryId || !tempDeliverer) return;
    onUpdateStatus(selectedDeliveryId, DeliveryStatus.IN_ROUTE, tempDeliverer);
    if (!deliverers.includes(tempDeliverer)) {
      onAddDeliverer(tempDeliverer);
    }
    setIsAssignModalOpen(false);
    setSelectedDeliveryId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full sm:w-auto">
          <FilterBtn active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="Todas" />
          <FilterBtn active={filter === DeliveryStatus.PENDING} onClick={() => setFilter(DeliveryStatus.PENDING)} label="Pendentes" />
          <FilterBtn active={filter === DeliveryStatus.IN_ROUTE} onClick={() => setFilter(DeliveryStatus.IN_ROUTE)} label="Em Rota" />
          <FilterBtn active={filter === DeliveryStatus.DELIVERED} onClick={() => setFilter(DeliveryStatus.DELIVERED)} label="Entregues" />
        </div>
        <button 
          onClick={() => setIsManageDeliverersOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase hover:bg-gray-50 transition-all shadow-sm shrink-0"
        >
          <User size={14} />
          Entregadores
        </button>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-200">
            <Truck className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-400">Nenhuma entrega encontrada.</p>
          </div>
        ) : (
          filtered.map(delivery => (
            <div key={delivery.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getStatusColor(delivery.status)}`}>
                    <Truck size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{delivery.clientName}</h3>
                    <div className="flex items-start gap-1 text-sm text-gray-500 mt-1">
                      <MapPin size={14} className="shrink-0 mt-0.5 text-gray-300" />
                      <span className="leading-tight text-xs line-clamp-2">{delivery.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                   {delivery.delivererName && (
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase border border-red-100">
                       <User size={12} />
                       {delivery.delivererName}
                     </div>
                   )}
                   <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(delivery.status)}`}>
                      {getStatusLabel(delivery.status)}
                   </div>
                   <div className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                      <Clock size={10} />
                      {delivery.completedAt ? 'Concluída' : 'Ativa'}
                   </div>
                </div>

                <div className="flex gap-2">
                   <button 
                      onClick={() => handleOpenMaps(delivery.address)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors text-xs font-bold uppercase"
                   >
                      <Navigation size={14} />
                      Rota
                   </button>
                   {delivery.status === DeliveryStatus.PENDING && (
                    <button 
                        onClick={() => handleStartDelivery(delivery.id)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-xs font-bold uppercase shadow-md shadow-red-100"
                    >
                        Iniciar
                    </button>
                   )}
                   {delivery.status === DeliveryStatus.IN_ROUTE && (
                    <button 
                        onClick={() => onUpdateStatus(delivery.id, DeliveryStatus.DELIVERED)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-xs font-bold uppercase shadow-md shadow-green-100"
                    >
                        Concluir
                    </button>
                   )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Atribuir Entregador */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-red-600 p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2"><UserCheck /> Iniciar Entrega</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="hover:bg-red-500 p-1 rounded-full transition-colors">
                <X />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Quem vai entregar?</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                  {deliverers.map(name => (
                    <button 
                      key={name}
                      onClick={() => setTempDeliverer(name)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm border transition-all ${tempDeliverer === name ? 'bg-red-50 border-red-500 text-red-600' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                   <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Ou digite um novo nome:</p>
                   <input 
                    type="text" 
                    placeholder="Nome do novo entregador..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm"
                    value={tempDeliverer}
                    onChange={(e) => setTempDeliverer(e.target.value)}
                   />
                </div>
              </div>
              <button 
                onClick={confirmStartDelivery}
                disabled={!tempDeliverer}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all mt-4 disabled:opacity-50"
              >
                Confirmar Saída
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gerenciar Entregadores */}
      {isManageDeliverersOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gray-900 p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2"><User /> Entregadores</h3>
              <button onClick={() => setIsManageDeliverersOpen(false)} className="hover:bg-gray-700 p-1 rounded-full transition-colors">
                <X />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Nome do entregador..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm"
                  value={newDelivererName}
                  onChange={(e) => setNewDelivererName(e.target.value)}
                />
                <button 
                  onClick={() => { onAddDeliverer(newDelivererName); setNewDelivererName(''); }}
                  className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                {deliverers.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-4 italic">Nenhum entregador cadastrado.</p>
                ) : (
                  deliverers.map(name => (
                    <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="font-bold text-gray-700 text-sm">{name}</span>
                      <button 
                        onClick={() => onRemoveDeliverer(name)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterBtn: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
      active ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

export default Deliveries;
