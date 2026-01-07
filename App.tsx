
import React from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Clients from './views/Clients';
import Sales from './views/Sales';
import Deliveries from './views/Deliveries';
import Inventory from './views/Inventory';
import Catalog from './views/Catalog';
import Login from './views/Login';
import Settings from './views/Settings';
import { 
  AppState, 
  Client, 
  Delivery, 
  DeliveryStatus, 
  Sale, 
  UserRole,
  Product
} from './types';
import { INITIAL_CLIENTS, INITIAL_PRODUCTS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('catalog');
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return localStorage.getItem('h-agua-auth') === 'true';
  });
  
  const [state, setState] = React.useState<AppState>(() => {
    const saved = localStorage.getItem('h-agua-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        sales: parsed.sales.map((s: any) => ({ ...s, date: new Date(s.date) })),
        deliveries: parsed.deliveries.map((d: any) => ({ ...d, scheduledFor: new Date(d.scheduledFor) })),
        deliverers: parsed.deliverers || []
      };
    }
    return {
      clients: INITIAL_CLIENTS as any,
      products: INITIAL_PRODUCTS,
      sales: [],
      deliveries: [],
      deliverers: [],
      currentUser: { name: 'Admin H Água', role: UserRole.ADMIN }
    };
  });

  React.useEffect(() => {
    localStorage.setItem('h-agua-state', JSON.stringify(state));
    const interval = setInterval(() => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    }, 30000);
    return () => clearInterval(interval);
  }, [state]);

  const handleLogin = (user: string, pass: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('h-agua-auth', 'true');
    setShowLogin(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('h-agua-auth');
    setActiveTab('catalog');
  };

  const addClient = (clientData: Partial<Client>) => {
    const newClient: Client = {
      id: `c-${Date.now()}`,
      name: clientData.name || 'Novo Cliente',
      phone: clientData.phone || '',
      address: clientData.address || '',
      type: clientData.type || 'RESIDENTIAL' as any,
      purchaseCount: 0
    };
    setState(prev => ({ ...prev, clients: [newClient, ...prev.clients] }));
  };

  const updateClient = (updatedClient: Client) => {
    setState(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === updatedClient.id ? updatedClient : c)
    }));
  };

  const removeClient = (id: string) => {
    setState(prev => ({
      ...prev,
      clients: prev.clients.filter(c => c.id !== id)
    }));
  };

  const addProduct = (productData: Partial<Product>) => {
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name: productData.name || 'Novo Produto',
      category: productData.category || 'WATER',
      price: productData.price || 0,
      stock: productData.stock || 0,
      minStock: productData.minStock || 5,
      icon: productData.icon || '📦'
    };
    setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
  };

  const addSale = (saleData: Omit<Sale, 'id'> & { address?: string }) => {
    const saleId = `s-${Date.now()}`;
    const deliveryId = `d-${Date.now()}`;
    const { address, ...restSaleData } = saleData;
    
    const newSale: Sale = { ...restSaleData, id: saleId, deliveryId };
    const client = state.clients.find(c => c.id === saleData.clientId);
    
    const newDelivery: Delivery = {
        id: deliveryId,
        saleId,
        clientId: saleData.clientId,
        clientName: client?.name || 'Cliente',
        address: address || client?.address || 'Endereço não informado',
        status: DeliveryStatus.PENDING,
        scheduledFor: new Date()
    };

    setState(prev => ({
        ...prev,
        sales: [newSale, ...prev.sales],
        deliveries: [newDelivery, ...prev.deliveries],
        products: prev.products.map(p => {
            const item = saleData.items.find(i => i.productId === p.id);
            return item ? { ...p, stock: p.stock - item.quantity } : p;
        }),
        clients: prev.clients.map(c => c.id === saleData.clientId ? { ...c, purchaseCount: c.purchaseCount + 1 } : c)
    }));
  };

  const updateDeliveryStatus = (id: string, status: DeliveryStatus, delivererName?: string) => {
    setState(prev => ({
        ...prev,
        deliveries: prev.deliveries.map(d => d.id === id ? { 
          ...d, 
          status, 
          delivererName: delivererName || d.delivererName,
          completedAt: status === DeliveryStatus.DELIVERED ? new Date() : undefined 
        } : d)
    }));
  };

  const addDeliverer = (name: string) => {
    if (!name || state.deliverers.includes(name)) return;
    setState(prev => ({ ...prev, deliverers: [...prev.deliverers, name] }));
  };

  const removeDeliverer = (name: string) => {
    setState(prev => ({ ...prev, deliverers: prev.deliverers.filter(n => n !== name) }));
  };

  const updateStock = (id: string, amount: number) => {
    setState(prev => ({
        ...prev,
        products: prev.products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p)
    }));
  };

  const handleRestoreState = (newState: AppState) => {
    const parsedState = {
      ...newState,
      sales: newState.sales.map(s => ({ ...s, date: new Date(s.date) })),
      deliveries: newState.deliveries.map(d => ({ ...d, scheduledFor: new Date(d.scheduledFor) })),
      deliverers: newState.deliverers || []
    };
    setState(parsedState);
  };

  const renderContent = () => {
    if (showLogin) return <Login onLogin={handleLogin} onCancel={() => setShowLogin(false)} />;
    
    switch (activeTab) {
      case 'catalog': return <Catalog products={state.products} onAdminAccess={() => setShowLogin(true)} />;
      case 'dashboard': return <Dashboard state={state} />;
      case 'clients': return (
        <Clients 
          clients={state.clients} 
          onAddClient={addClient} 
          onUpdateClient={updateClient}
          onRemoveClient={removeClient}
        />
      );
      case 'sales': return <Sales products={state.products} clients={state.clients} onProcessSale={addSale} />;
      case 'deliveries': return (
        <Deliveries 
          deliveries={state.deliveries} 
          deliverers={state.deliverers}
          onUpdateStatus={updateDeliveryStatus}
          onAddDeliverer={addDeliverer}
          onRemoveDeliverer={removeDeliverer}
        />
      );
      case 'inventory': return <Inventory products={state.products} onUpdateStock={updateStock} onAddProduct={addProduct} />;
      case 'settings': return <Settings state={state} onRestore={handleRestoreState} />;
      default: return <Catalog products={state.products} onAdminAccess={() => setShowLogin(true)} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      isSyncing={isSyncing}
      onLogout={handleLogout}
      isAuthenticated={isAuthenticated}
      onLoginClick={() => setShowLogin(true)}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
