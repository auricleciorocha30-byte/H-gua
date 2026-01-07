
import React from 'react';
import { Send, Bot, User, Sparkles, Loader2, TrendingUp, Lightbulb } from 'lucide-react';
import { askAssistant, getDemandPrediction, suggestPromotions } from '../services/geminiService';
import { AppState } from '../types';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

const AIChat: React.FC<{ state: AppState }> = ({ state }) => {
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'bot', text: 'Olá! Sou o H Assistente. Como posso ajudar com sua revenda hoje?' }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [prediction, setPrediction] = React.useState<{predictionSummary: string; stockSuggestions: string[]} | null>(null);
  const [promotions, setPromotions] = React.useState<Array<{title: string, description: string}>>([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await askAssistant(userMsg, state);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsLoading(false);
  };

  const loadPrediction = async () => {
    setIsLoading(true);
    const data = await getDemandPrediction(state);
    setPrediction(data);
    setMessages(prev => [...prev, { role: 'bot', text: 'Gerei uma nova previsão de demanda e estoque para você.' }]);
    setIsLoading(false);
  };

  const loadPromotions = async () => {
    setIsLoading(true);
    const data = await suggestPromotions(state);
    setPromotions(data);
    setMessages(prev => [...prev, { role: 'bot', text: 'Analisei seu estoque e criei algumas sugestões de promoções.' }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4">
      <div className="grid grid-cols-2 gap-3 shrink-0">
        <button 
            onClick={loadPrediction}
            className="flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-2xl font-bold text-xs hover:bg-red-100 transition-colors"
        >
          <TrendingUp size={16} /> Prever Demanda
        </button>
        <button 
            onClick={loadPromotions}
            className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-xs hover:bg-blue-100 transition-colors"
        >
          <Lightbulb size={16} /> Sugerir Promoção
        </button>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${
                m.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-red-500' : 'bg-white text-red-600 border border-gray-200'}`}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-gray-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-xs">H Água está pensando...</span>
               </div>
            </div>
          )}

          {/* Special Cards in Chat */}
          {prediction && (
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-3xl text-white shadow-xl space-y-4">
               <div className="flex items-center gap-2">
                 <Sparkles size={20} className="text-yellow-400" />
                 <h4 className="font-bold">Previsão Inteligente</h4>
               </div>
               <p className="text-sm opacity-90">{prediction.predictionSummary}</p>
               <div className="space-y-2">
                 {prediction.stockSuggestions.map((s, i) => (
                   <div key={i} className="bg-white bg-opacity-10 p-2 rounded-xl text-xs flex gap-2">
                     <span className="text-yellow-400">•</span> {s}
                   </div>
                 ))}
               </div>
            </div>
          )}

          {promotions.length > 0 && (
            <div className="space-y-2">
                {promotions.map((p, i) => (
                    <div key={i} className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                        <h4 className="font-bold text-blue-800 text-sm mb-1">{p.title}</h4>
                        <p className="text-xs text-blue-600">{p.description}</p>
                    </div>
                ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
          <input 
            type="text" 
            placeholder="Pergunte sobre estoque, clientes..."
            className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="p-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
