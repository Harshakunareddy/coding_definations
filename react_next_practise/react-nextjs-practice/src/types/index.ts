// ==========================================
// TYPES - Centralized type definitions
// ==========================================

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export interface Harsha {
  name?: string;
  is_login?: boolean;
  age?: number;
}