
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Truck, 
  AlertCircle,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AppState } from '../types';

const data = [
  { name: 'Seg', vendas: 1200 },
  { name: 'Ter', vendas: 1900 },
  { name: 'Qua', vendas: 1500 },
  { name: 'Qui', vendas: 2100 },
  { name: 'Sex', vendas: 2500 },
  { name: 'Sab', vendas: 3100 },
  { name: 'Dom', vendas: 800 },
];

const Dashboard: React.FC<{ state: AppState }> = ({ state }) => {
  const lowStockProducts = state.products.filter(p => p.stock <= p.minStock);
  const pendingDeliveries = state.deliveries.filter(d => d.status === 'PENDING').length;
  const totalRevenue = state.sales.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Faturamento (Mês)" 
          value={`R$ ${totalRevenue.toFixed(2)}`} 
          icon={<TrendingUp className="text-green-600" />}
          trend="+12% desde ontem"
          color="bg-green-50"
        />
        <StatCard 
          title="Clientes Ativos" 
          value={state.clients.length.toString()} 
          icon={<Users className="text-blue-600" />}
          trend="3 novos essa semana"
          color="bg-blue-50"
        />
        <StatCard 
          title="Entregas Pendentes" 
          value={pendingDeliveries.toString()} 
          icon={<Truck className="text-orange-600" />}
          trend="Tempo médio: 25min"
          color="bg-orange-50"
        />
        <StatCard 
          title="Alertas de Estoque" 
          value={lowStockProducts.length.toString()} 
          icon={<AlertCircle className="text-red-600" />}
          trend={lowStockProducts.length > 0 ? "Reposição sugerida" : "Tudo em ordem"}
          color="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={18} className="text-red-500" />
              Faturamento Semanal
            </h3>
            <select className="text-sm bg-gray-50 border-none rounded-lg p-1 px-2 focus:ring-0">
              <option>Últimos 7 dias</option>
              <option>Último mês</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#fef2f2' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="vendas" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Avisos de Estoque</h3>
          <div className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                   <AlertCircle size={24} />
                </div>
                <p className="text-gray-500 text-sm">Nenhum produto em nível crítico.</p>
              </div>
            ) : (
              lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{p.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                      <p className="text-xs text-red-600">Restante: {p.stock} un</p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-700">
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend: string; color: string }> = ({ title, value, icon, trend, color }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-400">{trend}</span>
    </div>
    <p className="text-gray-500 text-sm font-medium">{title}</p>
    <h2 className="text-2xl font-bold text-gray-900 mt-1">{value}</h2>
  </div>
);

export default Dashboard;
