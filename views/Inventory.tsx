
import React from 'react';
import { Package, Plus, AlertTriangle, TrendingDown, PackageOpen, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onUpdateStock: (id: string, amount: number) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onUpdateStock }) => {
  return (
    <div className="space-y-8">
      {/* Inventory Health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-red-50 rounded-2xl text-red-600">
                 <Package size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Itens Totais</p>
                <h4 className="text-2xl font-black text-gray-900">{products.reduce((acc, p) => acc + p.stock, 0)}</h4>
              </div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-50 rounded-2xl text-orange-600">
                 <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Abaixo do Mínimo</p>
                <h4 className="text-2xl font-black text-gray-900">{products.filter(p => p.stock <= p.minStock).length}</h4>
              </div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-1 sm:col-span-2">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                 <TrendingDown size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Sugestão Reposição</p>
                <h4 className="text-2xl font-black text-gray-900">3 Itens</h4>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <PackageOpen className="text-red-500" size={20} />
                Lista de Estoque
            </h3>
            <button className="text-red-600 font-bold text-sm flex items-center gap-1 hover:underline">
                <Plus size={16} /> Adicionar Produto
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-center">Quantidade</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.icon}</span>
                      <span className="font-bold text-gray-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-md font-bold uppercase">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                       <button onClick={() => onUpdateStock(product.id, -1)} className="p-1 hover:text-red-500 transition-colors text-gray-300"><ArrowDownCircle size={20}/></button>
                       <span className={`font-black w-8 text-center ${product.stock <= product.minStock ? 'text-red-600' : 'text-gray-900'}`}>{product.stock}</span>
                       <button onClick={() => onUpdateStock(product.id, 1)} className="p-1 hover:text-green-500 transition-colors text-gray-300"><ArrowUpCircle size={20}/></button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.stock <= product.minStock ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase">
                        <AlertTriangle size={12} /> Estoque Baixo
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-green-600 uppercase">Em Dia</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 text-sm font-bold">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
