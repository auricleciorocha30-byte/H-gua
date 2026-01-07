
import React from 'react';
import { Lock, User, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { AppLogo } from '../constants';

interface LoginProps {
  onLogin: (user: string, pass: string) => void;
  onCancel?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '123') {
      onLogin(username, password);
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      {onCancel && (
        <button 
          onClick={onCancel}
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar ao Encarte
        </button>
      )}

      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <AppLogo className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-gray-900">H Água</h1>
          <p className="text-gray-500 font-medium">Painel Administrativo</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Acesse sua conta</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Usuário</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium text-gray-800"
                  placeholder="Seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium text-gray-800"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm animate-shake">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:-translate-y-0.5 transition-all active:scale-[0.98]"
            >
              Entrar no Sistema
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            Acesso exclusivo para administradores da H Água.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
