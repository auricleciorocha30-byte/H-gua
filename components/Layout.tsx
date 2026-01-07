
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Truck, 
  Package, 
  Menu, 
  X,
  Bell,
  LogOut,
  Image as ImageIcon,
  Lock,
  Settings as SettingsIcon
} from 'lucide-react';
import { AppLogo, COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSyncing: boolean;
  onLogout: () => void;
  isAuthenticated: boolean;
  onLoginClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  isSyncing, 
  onLogout,
  isAuthenticated,
  onLoginClick
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const publicItems = [
    { id: 'catalog', label: 'Encarte', icon: ImageIcon },
  ];

  const adminItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart },
    { id: 'deliveries', label: 'Entregas', icon: Truck },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'inventory', label: 'Estoque', icon: Package },
    { id: 'settings', label: 'Ajustes', icon: SettingsIcon },
  ];

  const currentNavItems = isAuthenticated ? [...publicItems, ...adminItems] : publicItems;

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop - Only for Auth */}
      {isAuthenticated && (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="p-6 flex items-center gap-3 border-b border-gray-100">
            <AppLogo className="w-10 h-10" />
            <span className="font-bold text-xl text-red-600">H Água</span>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {currentNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center w-full gap-3 p-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-red-50 text-red-600 font-semibold' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100 space-y-4">
             <button 
               onClick={onLogout}
               className="flex items-center w-full gap-3 p-3 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
             >
                <LogOut size={20} />
                <span className="font-medium text-sm">Sair</span>
             </button>
             <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
                {isSyncing ? 'Sincronizando...' : 'Online & Sincronizado'}
             </div>
          </div>
        </aside>
      )}

      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Mobile */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
             <AppLogo className="w-8 h-8" />
             <span className="font-bold text-lg text-red-600">H Água</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400"><X /></button>
        </div>
        <nav className="p-4 space-y-2">
          {currentNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex items-center w-full gap-3 p-3 rounded-xl ${
                activeTab === item.id ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-500'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
          {isAuthenticated ? (
            <button 
              onClick={onLogout}
              className="flex items-center w-full gap-3 p-3 rounded-xl text-gray-400"
            >
               <LogOut size={20} />
               <span className="font-medium">Sair</span>
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="flex items-center w-full gap-3 p-3 rounded-xl text-red-600 font-bold"
            >
               <Lock size={20} />
               <span className="font-medium">Admin Login</span>
            </button>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-500">
                <Menu />
              </button>
            )}
            <div className="flex items-center gap-2">
              <AppLogo className="w-8 h-8" />
              <span className="font-bold text-red-600">H Água</span>
              <span className="hidden sm:inline text-xs text-gray-400 ml-2 font-medium">Água com confiança</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button className="relative p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Bell size={22} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold border border-red-200">
                  A
                </div>
              </>
            ) : (
              <button 
                onClick={onLoginClick}
                className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1 uppercase tracking-wider"
              >
                <Lock size={14} />
                Acesso Restrito
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
          {children}
        </main>

        {/* Mobile Nav Bar */}
        <nav className="md:hidden bg-white border-t border-gray-200 flex justify-around p-3 shrink-0">
          {isAuthenticated ? (
            <>
              {[adminItems[0], adminItems[1], adminItems[4], adminItems[5]].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex flex-col items-center gap-1 ${
                    activeTab === item.id ? 'text-red-600' : 'text-gray-400'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              ))}
            </>
          ) : (
            <button className="flex flex-col items-center gap-1 text-red-600">
              <ImageIcon size={20} />
              <span className="text-[10px] font-medium">Encarte</span>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
