// src/app/modules/purchase/model/enhanced-purchase.model.ts

import { Payment } from "./payment.model";

export interface Product {
  productId: number;
  productName: string;
  category: string;
  subCategory: string;
  unit: string;
  gender?: string;
  isActive: boolean;
  createdDate?: Date;
  modifiedDate?: Date;
}

export interface ProductCategory {
  categoryId: number;
  categoryName: string;
  subCategories: string[];
  isActive: boolean;
}

export interface PurchaseProduct {
  productId: number;
  productName: string;
  quantity: number;
  ratePerUnit: number;
  totalAmount: number;
  // Auto-calculated overhead allocation fields
  percentageOfPurchase?: number;
  allocatedTax?: number;
  allocatedTransport?: number;
  allocatedPackingCharge?: number;
  totalAllocatedOverhead?: number;
  finalCostPerUnit?: number;
}

export interface EnhancedPurchaseRequest {
  partyName: string;
  purchaseDate: Date | string;
  purchaseProducts: PurchaseProduct[];
  packingCharge: number;
  taxAmount: number;
  taxPercent: number;
  discountAmount: number;
  discountPercent: number;
  extraDiscountAmount: number;
  transport?: {
    transportName: string;
    amount: number;
    consignmentNumber: string;
  };
  payments?: Payment[];
}

export interface OverheadCosts {
  taxAmount: number;
  packingCharge: number;
  transportAmount: number;
}

export interface EnhancedPurchaseResponse {
  success: boolean;
  data: {
    purchase: any;
    products: any[];
    message: string;
  };
  message: string;
}

// Product filters for search/dropdown
export interface ProductFilters {
  category?: string;
  subCategory?: string;
  gender?: string;
  search?: string;
}

// Enhanced form validation
export interface ProductValidationError {
  index: number;
  field: string;
  message: string;
}

export interface PurchaseFormValidation {
  isValid: boolean;
  errors: ProductValidationError[];
  warnings: string[];
}