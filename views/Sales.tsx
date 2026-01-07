
import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle2, QrCode, Banknote, CreditCard, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Product, PaymentMethod, Client } from '../types';

interface SalesProps {
  products: Product[];
  clients: Client[];
  onProcessSale: (saleData: any) => void;
}

const Sales: React.FC<SalesProps> = ({ products, clients, onProcessSale }) => {
  const [cart, setCart] = React.useState<Array<{ id: string; name: string; quantity: number; price: number }>>([]);
  const [selectedClient, setSelectedClient] = React.useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = React.useState<string>('');
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>(PaymentMethod.CASH);
  const [showReceipt, setShowReceipt] = React.useState(false);

  // Update address when client is selected
  React.useEffect(() => {
    if (selectedClient) {
      const client = clients.find(c => c.id === selectedClient);
      if (client) {
        setDeliveryAddress(client.address);
      }
    } else {
      setDeliveryAddress('');
    }
  }, [selectedClient, clients]);

  const addToCart = (product: Product) => {
    const inCart = cart.find(item => item.id === product.id)?.quantity || 0;
    
    // Check if adding one more exceeds stock
    if (inCart + 1 > product.stock) {
      alert(`Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, quantity: 1, price: product.price }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > product.stock) {
            alert(`Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`);
            return item;
        }
        return { ...item, quantity: Math.max(0, newQty) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleFinish = () => {
    if (cart.length === 0 || !selectedClient || !deliveryAddress) return;
    onProcessSale({
        clientId: selectedClient,
        address: deliveryAddress, // Pass the custom/filled address
        items: cart,
        total,
        paymentMethod,
        date: new Date()
    });
    setShowReceipt(true);
    setTimeout(() => {
        setShowReceipt(false);
        setCart([]);
        setSelectedClient('');
        setDeliveryAddress('');
    }, 3000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Product Selection */}
      <div className="xl:col-span-2 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.map(product => {
            const inCart = cart.find(i => i.id === product.id)?.quantity || 0;
            const remaining = product.stock - inCart;
            const isOutOfStock = product.stock <= 0;

            return (
              <button
                key={product.id}
                disabled={isOutOfStock}
                onClick={() => addToCart(product)}
                className={`bg-white p-5 rounded-2xl shadow-sm border transition-all text-center flex flex-col items-center gap-2 group relative ${
                  isOutOfStock 
                    ? 'opacity-60 cursor-not-allowed border-gray-100 grayscale' 
                    : 'border-gray-100 hover:border-red-200 hover:shadow-md'
                }`}
              >
                <span className={`text-4xl transition-transform ${!isOutOfStock && 'group-hover:scale-110'}`}>{product.icon}</span>
                <h4 className="font-bold text-gray-800 text-sm mt-2">{product.name}</h4>
                <div className="flex flex-col items-center">
                    <p className={`${isOutOfStock ? 'text-gray-400' : 'text-red-600'} font-bold`}>
                        {isOutOfStock ? 'Esgotado' : `R$ ${product.price.toFixed(2)}`}
                    </p>
                    <span className={`text-[10px] font-bold uppercase mt-1 ${remaining <= product.minStock ? 'text-red-500' : 'text-gray-400'}`}>
                        {remaining} em estoque
                    </span>
                </div>
                {!isOutOfStock && (
                  <div className="mt-3 bg-red-50 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={16} />
                  </div>
                )}
                {isOutOfStock && (
                  <div className="mt-3 text-gray-400 p-2 rounded-full">
                    <AlertCircle size={16} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[calc(100vh-160px)]">
        <div className="p-6 bg-red-600 text-white flex items-center gap-3">
          <ShoppingCart />
          <h3 className="font-bold text-lg">Carrinho de Compras</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {/* Client Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">1. Selecionar Cliente</label>
            <select 
              value={selectedClient} 
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-medium"
            >
              <option value="">Escolha um cliente...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Delivery Address */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">2. Endereço de Entrega</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-300" size={18} />
              <textarea 
                placeholder="Preencha o endereço completo..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm min-h-[80px]"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase">3. Produtos</label>
            {cart.length === 0 ? (
              <p className="text-center text-gray-400 py-6 text-sm italic">O carrinho está vazio</p>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-xs">{item.name}</p>
                      <p className="text-[10px] text-gray-500">R$ {item.price.toFixed(2)} / un</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Minus size={14}/></button>
                      <span className="font-black text-gray-800 w-4 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Plus size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">4. Forma de Pagamento</label>
            <div className="grid grid-cols-2 gap-2">
              <PaymentBtn active={paymentMethod === PaymentMethod.CASH} onClick={() => setPaymentMethod(PaymentMethod.CASH)} icon={<Banknote size={16}/>} label="Dinheiro" />
              <PaymentBtn active={paymentMethod === PaymentMethod.PIX} onClick={() => setPaymentMethod(PaymentMethod.PIX)} icon={<QrCode size={16}/>} label="Pix" />
              <PaymentBtn active={paymentMethod === PaymentMethod.CARD} onClick={() => setPaymentMethod(PaymentMethod.CARD)} icon={<CreditCard size={16}/>} label="Cartão" />
              <PaymentBtn active={paymentMethod === PaymentMethod.DEBT} onClick={() => setPaymentMethod(PaymentMethod.DEBT)} icon={<Clock size={16}/>} label="Fiado" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-bold uppercase text-xs">Total do Pedido</span>
            <span className="text-2xl font-black text-red-600">R$ {total.toFixed(2)}</span>
          </div>
          <button 
            disabled={cart.length === 0 || !selectedClient || !deliveryAddress}
            onClick={handleFinish}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${
                cart.length === 0 || !selectedClient || !deliveryAddress ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200 hover:-translate-y-0.5'
            }`}
          >
            Finalizar e Agendar Entrega
          </button>
        </div>
      </div>

      {showReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-[3rem] text-center space-y-4 max-w-xs w-full animate-bounce shadow-2xl">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Venda Realizada!</h2>
                <p className="text-gray-500 text-sm">O comprovante foi gerado e a entrega já está na fila.</p>
            </div>
        </div>
      )}
    </div>
  );
};

const PaymentBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 p-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
      active ? 'bg-red-50 border-red-500 text-red-600' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default Sales;
