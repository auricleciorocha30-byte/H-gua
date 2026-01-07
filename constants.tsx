
import React from 'react';

export const COLORS = {
  primary: '#EF4444', // Red-500
  primaryHover: '#DC2626', // Red-600
  secondary: '#FFFFFF',
  text: '#1F2937',
  muted: '#9CA3AF',
  lightGray: '#F3F4F6'
};

export const AppLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full text-red-500">
      <path d="M50 5 L15 85 Q50 100 85 85 Z" fill="currentColor" />
      <text x="50" y="65" textAnchor="middle" fill="white" fontSize="40" fontWeight="bold">H</text>
    </svg>
  </div>
);

export const INITIAL_PRODUCTS = [
  // Águas Minerais
  { id: 'p1', name: 'Naturagua (mineral)', category: 'WATER', price: 14.99, stock: 50, minStock: 10, icon: '💧' },
  { id: 'p2', name: 'Límpida (mineral)', category: 'WATER', price: 13.99, stock: 40, minStock: 10, icon: '💧' },
  { id: 'p3', name: 'Neblina (mineral)', category: 'WATER', price: 13.99, stock: 35, minStock: 8, icon: '💧' },
  { id: 'p4', name: 'Serra Grande (mineral)', category: 'WATER', price: 13.99, stock: 30, minStock: 8, icon: '💧' },
  
  // Águas Adicionadas de Sais
  { id: 'p5', name: 'Realfina (adicionada)', category: 'WATER', price: 5.99, stock: 100, minStock: 20, icon: '🧂' },
  { id: 'p6', name: 'Plurágua (adicionada)', category: 'WATER', price: 5.99, stock: 80, minStock: 15, icon: '🧂' },
  { id: 'p7', name: 'Ouro Azul (adicionada)', category: 'WATER', price: 7.99, stock: 60, minStock: 12, icon: '🧂' },
  
  // Outros e Gás
  { id: 'p8', name: 'Caderneta (Taxa)', category: 'OTHER', price: 0.50, stock: 999, minStock: 0, icon: '📔' },
  { id: 'p9', name: 'Gás P13', category: 'GAS', price: 115.00, stock: 15, minStock: 5, icon: '🔥' },
];

export const INITIAL_CLIENTS = [
  { id: 'c1', name: 'Maria Silva', phone: '85992592012', address: 'Rua 108, 400 - Conj. Esperança', type: 'RESIDENTIAL', purchaseCount: 15 },
  { id: 'c2', name: 'Padaria Sol', phone: '85988776655', address: 'Rua das Flores, 10', type: 'COMMERCIAL', purchaseCount: 42 },
  { id: 'c3', name: 'João Pereira', phone: '85977665544', address: 'Av. Contorno, 500', type: 'RESIDENTIAL', purchaseCount: 2 },
];
