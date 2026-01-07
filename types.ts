
export enum UserRole {
  ADMIN = 'ADMIN',
  DELIVERER = 'DELIVERER',
  SALES = 'SALES'
}

export enum ClientType {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL'
}

export enum PaymentMethod {
  CASH = 'CASH',
  PIX = 'PIX',
  CARD = 'CARD',
  DEBT = 'DEBT' // Fiado
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_ROUTE = 'IN_ROUTE',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  type: ClientType;
  lastPurchase?: Date;
  purchaseCount: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'WATER' | 'GAS' | 'PACK' | 'OTHER';
  price: number;
  stock: number;
  minStock: number;
  icon: string;
}

export interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: PaymentMethod;
  date: Date;
  deliveryId?: string;
}

export interface Delivery {
  id: string;
  saleId: string;
  clientId: string;
  clientName: string;
  address: string;
  status: DeliveryStatus;
  delivererName?: string;
  scheduledFor: Date;
  completedAt?: Date;
}

export interface AppState {
  clients: Client[];
  products: Product[];
  sales: Sale[];
  deliveries: Delivery[];
  currentUser: {
    name: string;
    role: UserRole;
  } | null;
}
