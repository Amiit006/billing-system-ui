// src/app/modules/purchase/services/enhanced-purchase.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { 
  EnhancedPurchaseRequest, 
  EnhancedPurchaseResponse, 
  PurchaseProduct, 
  OverheadCosts,
  PurchaseFormValidation,
  ProductValidationError
} from '../model/enhanced-purchase.model';

@Injectable({
  providedIn: 'root'
})
export class EnhancedPurchaseService {
  
  constructor(private http: HttpClient) {}

  /**
   * Create purchase with product breakdown using enhanced API
   */
  createPurchaseWithProducts(seasonId: string, purchaseData: EnhancedPurchaseRequest): Observable<EnhancedPurchaseResponse> {
    let params = new HttpParams().set('seasonId', seasonId);
    
    return this.http.post<EnhancedPurchaseResponse>(
      `${environment.baseUrl}purchase/createWithProducts`, 
      purchaseData, 
      { params }
    ).pipe(
      catchError(error => {
        console.error('Error creating enhanced purchase:', error);
        throw error;
      })
    );
  }

  /**
   * Calculate overhead allocation for products in real-time
   */
  calculateOverheadAllocation(
    products: PurchaseProduct[], 
    overheadCosts: OverheadCosts
  ): PurchaseProduct[] {
    if (!products || products.length === 0) {
      return [];
    }

    // Calculate total purchase value from all products
    const totalPurchaseValue = products.reduce((sum, product) => {
      return sum + (product.totalAmount || 0);
    }, 0);

    if (totalPurchaseValue === 0) {
      return products.map(product => ({
        ...product,
        percentageOfPurchase: 0,
        allocatedTax: 0,
        allocatedTransport: 0,
        allocatedPackingCharge: 0,
        totalAllocatedOverhead: 0,
        finalCostPerUnit: product.ratePerUnit || 0
      }));
    }

    return products.map(product => {
      // Calculate percentage contribution of this product
      const percentage = (product.totalAmount || 0) / totalPurchaseValue;
      
      // Allocate overhead costs proportionally
      const allocatedTax = (overheadCosts.taxAmount || 0) * percentage;
      const allocatedTransport = (overheadCosts.transportAmount || 0) * percentage;
      const allocatedPackingCharge = (overheadCosts.packingCharge || 0) * percentage;
      const totalAllocatedOverhead = allocatedTax + allocatedTransport + allocatedPackingCharge;
      
      // Calculate final cost per unit including allocated overhead
      const finalCostPerUnit = product.quantity > 0 
        ? ((product.totalAmount || 0) + totalAllocatedOverhead) / product.quantity
        : 0;

      return {
        ...product,
        percentageOfPurchase: Math.round(percentage * 10000) / 100, // Round to 2 decimals
        allocatedTax: Math.round(allocatedTax * 100) / 100,
        allocatedTransport: Math.round(allocatedTransport * 100) / 100,
        allocatedPackingCharge: Math.round(allocatedPackingCharge * 100) / 100,
        totalAllocatedOverhead: Math.round(totalAllocatedOverhead * 100) / 100,
        finalCostPerUnit: Math.round(finalCostPerUnit * 100) / 100
      };
    });
  }

  /**
   * Calculate total purchase amount from products
   */
  calculateTotalPurchaseAmount(products: PurchaseProduct[]): number {
    if (!products || products.length === 0) {
      return 0;
    }
    
    return products.reduce((sum, product) => {
      return sum + (product.totalAmount || 0);
    }, 0);
  }

  /**
   * Calculate product total amount (quantity * rate)
   */
  calculateProductTotal(quantity: number, ratePerUnit: number): number {
    const total = (quantity || 0) * (ratePerUnit || 0);
    return Math.round(total * 100) / 100;
  }

  /**
   * Validate purchase products before submission
   */
  validatePurchaseProducts(products: PurchaseProduct[]): PurchaseFormValidation {
    const errors: ProductValidationError[] = [];
    const warnings: string[] = [];

    if (!products || products.length === 0) {
      errors.push({
        index: -1,
        field: 'products',
        message: 'At least one product is required'
      });
    }

    products.forEach((product, index) => {
      // Validate required fields
      if (!product.productId) {
        errors.push({
          index,
          field: 'productId',
          message: 'Product selection is required'
        });
      }

      if (!product.quantity || product.quantity <= 0) {
        errors.push({
          index,
          field: 'quantity',
          message: 'Quantity must be greater than 0'
        });
      }

      if (!product.ratePerUnit || product.ratePerUnit <= 0) {
        errors.push({
          index,
          field: 'ratePerUnit',
          message: 'Rate per unit must be greater than 0'
        });
      }

      // Validate calculated total
      const calculatedTotal = this.calculateProductTotal(product.quantity, product.ratePerUnit);
      if (Math.abs(calculatedTotal - (product.totalAmount || 0)) > 0.01) {
        errors.push({
          index,
          field: 'totalAmount',
          message: 'Total amount does not match quantity × rate'
        });
      }

      // Warnings for unusually high quantities or rates
      if (product.quantity > 1000) {
        warnings.push(`Product ${index + 1}: Very high quantity (${product.quantity})`);
      }

      if (product.ratePerUnit > 10000) {
        warnings.push(`Product ${index + 1}: Very high rate per unit (₹${product.ratePerUnit})`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  }

  /**
   * Get empty product template for form
   */
  getEmptyProduct(): PurchaseProduct {
    return {
      productId: null,
      productName: '',
      quantity: 0,
      ratePerUnit: 0,
      totalAmount: 0,
      percentageOfPurchase: 0,
      allocatedTax: 0,
      allocatedTransport: 0,
      allocatedPackingCharge: 0,
      totalAllocatedOverhead: 0,
      finalCostPerUnit: 0
    };
  }

  /**
   * Convert basic purchase data to enhanced format (for migration)
   */
  convertBasicToEnhanced(basicPurchase: any): EnhancedPurchaseRequest {
    return {
      partyName: basicPurchase.partyName,
      purchaseDate: basicPurchase.purchaseDate,
      purchaseProducts: [], // Will need to be populated manually
      packingCharge: basicPurchase.packingCharge || 0,
      taxAmount: basicPurchase.taxAmount || 0,
      taxPercent: basicPurchase.taxPercent || 0,
      discountAmount: basicPurchase.discountAmount || 0,
      discountPercent: basicPurchase.discountPercent || 0,
      extraDiscountAmount: basicPurchase.extraDiscountAmount || 0,
      transport: basicPurchase.transport,
      payments: basicPurchase.payments
    };
  }
}