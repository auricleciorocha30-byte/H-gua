
import React from 'react';
import { Share2, MapPin, Phone, MessageCircle, Lock, Clock, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { AppLogo } from '../constants';

interface CatalogProps {
  products: Product[];
  onAdminAccess?: () => void;
}

const Catalog: React.FC<CatalogProps> = ({ products, onAdminAccess }) => {
  const handleOrder = (product: Product) => {
    if (product.stock <= 0) return;
    const message = encodeURIComponent(`Olá H Água! Gostaria de pedir: ${product.name} (R$ ${product.price.toFixed(2)})`);
    window.open(`https://wa.me/558592592012?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-xl font-bold text-gray-800">Nosso Encarte</h2>
        <div className="flex gap-2">
          {onAdminAccess && (
            <button onClick={onAdminAccess} className="p-2 md:p-3 bg-gray-100 text-gray-500 rounded-2xl hover:text-red-600 transition-colors flex items-center gap-2">
              <Lock size={18} />
              <span className="hidden sm:inline text-sm font-bold">Admin</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow-2xl rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-gray-100">
        <div className="bg-red-600 p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white opacity-5 rounded-full"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <AppLogo className="w-20 h-20 md:w-24 md:h-24 mb-4 filter drop-shadow-lg" />
            <h1 className="text-2xl md:text-4xl font-black mb-1">PROMOÇÃO DA SEMANA</h1>
            <p className="text-red-100 font-medium tracking-widest text-xs md:sm uppercase">Água com confiança direto para você</p>
          </div>
        </div>

        <div className="p-4 md:p-12 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {products.filter(p => p.id !== 'p8').map((product) => {
              const isOutOfStock = product.stock <= 0;
              return (
                <div key={product.id} className={`group flex flex-col items-center p-4 md:p-6 border rounded-[2rem] transition-all relative overflow-hidden bg-white ${isOutOfStock ? 'opacity-75 grayscale border-gray-200' : 'hover:border-red-100 border-gray-100 hover:shadow-xl hover:shadow-red-50'}`}>
                  <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {product.icon}
                  </div>
                  <h3 className="text-md md:text-lg font-bold text-gray-800 text-center leading-tight mb-2 h-10 flex items-center">
                    {product.name}
                  </h3>
                  <div className="mt-2 mb-4">
                     <div className="text-[10px] text-gray-400 font-bold uppercase text-center mb-1">Por apenas</div>
                     <div className={`text-2xl md:text-3xl font-black flex items-baseline justify-center ${isOutOfStock ? 'text-gray-400' : 'text-red-600'}`}>
                       <span className="text-xs md:text-sm mr-1">R$</span>
                       {product.price.toFixed(2).split('.')[0]}
                       <span className="text-md md:text-lg">,{product.price.toFixed(2).split('.')[1]}</span>
                     </div>
                  </div>
                  
                  <button 
                    disabled={isOutOfStock}
                    onClick={() => handleOrder(product)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                      isOutOfStock 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-green-500 text-white hover:bg-green-600 shadow-green-100'
                    }`}
                  >
                    {isOutOfStock ? <AlertCircle size={18} /> : <MessageCircle size={18} />}
                    {isOutOfStock ? 'Sem Estoque' : 'Pedir agora'}
                  </button>

                  {!isOutOfStock && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-full uppercase">
                      OFERTA
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute top-4 right-4 bg-gray-400 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">
                      ESGOTADO
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 md:mt-12 p-4 md:p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="text-3xl md:text-4xl">📔</div>
                <div>
                    <h4 className="font-bold text-gray-800 text-sm md:text-base">Água na Caderneta</h4>
                    <p className="text-xs md:text-sm text-gray-500 italic">Taxa adicional de R$ 0,50 no valor unitário.</p>
                </div>
            </div>
            <div className="text-lg md:text-xl font-black text-red-600">
                + R$ 0,50
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-6 md:p-10 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center shrink-0">
                        <AppLogo className="w-8 h-8 md:w-12 md:h-12" />
                    </div>
                    <div>
                        <h4 className="text-lg md:text-xl font-black">H Água</h4>
                        <p className="text-gray-400 text-xs md:text-sm">Água com confiança</p>
                    </div>
                </div>
                
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-xs md:text-sm">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                            <Phone size={14} />
                        </div>
                        <span className="font-bold">85 9259-2012</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs md:text-sm">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                            <MapPin size={14} />
                        </div>
                        <span className="text-gray-400">Rua 108, 337 - Conj. Esperança, Fortaleza - CE</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs md:text-sm">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                            <Clock size={14} />
                        </div>
                        <span className="text-gray-400">Qua: 08:00-12:00, 14:00-18:00</span>
                    </div>
                </div>

                <div className="text-center md:text-right">
                    <div className="text-yellow-400 font-black text-md md:text-lg mb-1 uppercase tracking-wider">ENTREGA RÁPIDA</div>
                    <p className="text-[10px] md:text-xs text-gray-500 max-w-[200px]">Peça pelo WhatsApp e receba em sua casa com segurança.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
