
import React from 'react';
import { Truck, MapPin, CheckCircle, Clock, Navigation, Phone } from 'lucide-react';
import { Delivery, DeliveryStatus } from '../types';

interface DeliveriesProps {
  deliveries: Delivery[];
  onUpdateStatus: (id: string, status: DeliveryStatus) => void;
}

const Deliveries: React.FC<DeliveriesProps> = ({ deliveries, onUpdateStatus }) => {
  const [filter, setFilter] = React.useState<DeliveryStatus | 'ALL'>('ALL');

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

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <FilterBtn active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="Todas" />
        <FilterBtn active={filter === DeliveryStatus.PENDING} onClick={() => setFilter(DeliveryStatus.PENDING)} label="Pendentes" />
        <FilterBtn active={filter === DeliveryStatus.IN_ROUTE} onClick={() => setFilter(DeliveryStatus.IN_ROUTE)} label="Em Rota" />
        <FilterBtn active={filter === DeliveryStatus.DELIVERED} onClick={() => setFilter(DeliveryStatus.DELIVERED)} label="Entregues" />
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
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getStatusColor(delivery.status)}`}>
                    <Truck size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{delivery.clientName}</h3>
                    <div className="flex items-start gap-1 text-sm text-gray-500 mt-1">
                      <MapPin size={14} className="shrink-0 mt-0.5" />
                      <span className="leading-tight">{delivery.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(delivery.status)}`}>
                      {getStatusLabel(delivery.status)}
                   </div>
                   <div className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                      <Clock size={10} />
                      Recente
                   </div>
                </div>

                <div className="flex gap-2">
                   <button 
                      onClick={() => handleOpenMaps(delivery.address)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors text-xs font-bold uppercase"
                   >
                      <Navigation size={14} />
                      Abrir Rota
                   </button>
                   {delivery.status !== DeliveryStatus.DELIVERED && (
                    <button 
                        onClick={() => onUpdateStatus(delivery.id, delivery.status === DeliveryStatus.PENDING ? DeliveryStatus.IN_ROUTE : DeliveryStatus.DELIVERED)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-xs font-bold uppercase shadow-md shadow-red-100"
                    >
                        {delivery.status === DeliveryStatus.PENDING ? 'Iniciar Entrega' : 'Finalizar Entrega'}
                    </button>
                   )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
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
