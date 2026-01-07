
import React from 'react';
import { Package, Plus, AlertTriangle, TrendingDown, PackageOpen, ArrowUpCircle, ArrowDownCircle, X, Edit2, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onUpdateStock: (id: string, amount: number) => void;
  onAddProduct: (product: Partial<Product>) => void;
  onUpdateProduct: (product: Product) => void;
  onRemoveProduct: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onUpdateStock, onAddProduct, onUpdateProduct, onRemoveProduct }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Partial<Product> | null>(null);
  const [formData, setFormData] = React.useState<Partial<Product>>({
    name: '',
    category: 'WATER',
    price: 0,
    stock: 0,
    minStock: 5,
    icon: '💧'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (formData.id) {
      onUpdateProduct(formData as Product);
    } else {
      onAddProduct(formData);
    }
    
    closeModal();
  };

  const openModal = (product?: Product) => {
    if (product) {
      setFormData(product);
      setEditingProduct(product);
    } else {
      setFormData({ name: '', category: 'WATER', price: 0, stock: 0, minStock: 5, icon: '💧' });
      setEditingProduct(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este produto permanentemente do estoque?')) {
      onRemoveProduct(id);
    }
  };

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
                <p className="text-sm text-gray-500 font-medium">Categorias Ativas</p>
                <h4 className="text-2xl font-black text-gray-900">{new Set(products.map(p => p.category)).size}</h4>
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
            <button 
              onClick={() => openModal()}
              className="text-red-600 font-bold text-sm flex items-center gap-1 hover:underline"
            >
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
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openModal(product)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Produto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-red-600 p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button onClick={closeModal} className="hover:bg-red-500 p-1 rounded-full transition-colors">
                <X />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-4 gap-4">
                 <div className="col-span-1 text-center">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ícone</label>
                    <input 
                      type="text"
                      className="w-full py-3 bg-gray-50 border border-gray-100 rounded-xl text-center text-xl outline-none"
                      value={formData.icon}
                      onChange={e => setFormData({...formData, icon: e.target.value})}
                    />
                 </div>
                 <div className="col-span-3">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nome do Produto</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
                      placeholder="Ex: Água 20L Naturagua"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Categoria</label>
                    <select 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-medium"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as any})}
                    >
                        <option value="WATER">Água</option>
                        <option value="GAS">Gás</option>
                        <option value="PACK">Fardo</option>
                        <option value="OTHER">Outros</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Preço (R$)</label>
                    <input 
                      type="number" step="0.01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-medium"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                    />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Estoque Inicial</label>
                    <input 
                      type="number"
                      disabled={!!editingProduct}
                      className={`w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-medium ${editingProduct ? 'opacity-50' : ''}`}
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Estoque Mínimo</label>
                    <input 
                      type="number"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-medium"
                      value={formData.minStock}
                      onChange={e => setFormData({...formData, minStock: parseInt(e.target.value)})}
                    />
                  </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all mt-4"
              >
                {editingProduct ? 'Salvar Alterações' : 'Salvar no Estoque'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
