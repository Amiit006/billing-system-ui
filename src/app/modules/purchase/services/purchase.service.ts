// src/app/modules/purchase/services/purchase.service.ts
// MODIFIED: Enhanced version with both old and new methods

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EnhancedPurchaseRequest, EnhancedPurchaseResponse } from '../model/enhanced-purchase.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private httpClient: HttpClient) { }

  // ============================================
  // EXISTING METHODS - Keep for backward compatibility
  // ============================================

  /**
   * @deprecated Use createPurchaseWithProducts for enhanced functionality
   */
  getPurchasesBySeason(seasonId: number) {
    let params = new HttpParams();
    params = params.append('seasonId', seasonId.toString());
    return this.httpClient.get(environment.baseUrl + 'purchase', { params: params });
  }

  /**
   * @deprecated Use createPurchaseWithProducts for enhanced functionality
   */
  createPurchase(seasonId, payload) {
    let params = new HttpParams();
    params = params.append('seasonId', seasonId.toString());
    return this.httpClient.post(environment.baseUrl + 'purchase/create', payload, { params: params });
  }

  // ============================================
  // NEW ENHANCED METHODS - Primary going forward
  // ============================================

  /**
   * Create purchase with product breakdown using enhanced API
   * This is the new primary method for purchase creation
   */
  createPurchaseWithProducts(seasonId: string, purchaseData: EnhancedPurchaseRequest): Observable<EnhancedPurchaseResponse> {
    let params = new HttpParams().set('seasonId', seasonId);
    return this.httpClient.post<EnhancedPurchaseResponse>(
      `${environment.baseUrl}purchase/createWithProducts`, 
      purchaseData, 
      { params }
    );
  }

  /**
   * Get purchase with product breakdown
   */
  getPurchaseWithProducts(purchaseId: number): Observable<any> {
    return this.httpClient.get<any>(`${environment.baseUrl}purchase/withProducts/${purchaseId}`);
  }

  /**
   * Get all purchases with product breakdown for a season
   */
  getPurchasesWithProductsBySeason(seasonId: string): Observable<any> {
    let params = new HttpParams().set('seasonId', seasonId);
    return this.httpClient.get<any>(`${environment.baseUrl}purchase/withProducts`, { params });
  }

  /**
   * Get enhanced purchases for listing (combines basic + product data)
   * This will be used in Phase 2 for enhanced purchase listing
   */
  getEnhancedPurchasesBySeason(seasonId: string): Observable<any> {
    // For now, use the basic method but can be enhanced to call withProducts
    let params = new HttpParams().set('seasonId', seasonId);
    return this.httpClient.get(`${environment.baseUrl}purchase`, { params });
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Convert basic purchase format to enhanced format
   * Useful for migration and backward compatibility
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

  /**
   * Check if enhanced API is available
   * Can be used for feature detection and graceful fallback
   */
  isEnhancedApiAvailable(): Observable<boolean> {
    // Simple check - you can implement more sophisticated detection
    return new Observable(observer => {
      observer.next(true); // For now, assume it's available
      observer.complete();
    });
  }
}