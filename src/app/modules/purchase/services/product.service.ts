// src/app/modules/purchase/services/product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product, ProductCategory, ProductFilters } from '../model/enhanced-purchase.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private http: HttpClient) {}

  /**
   * Get all products with optional filtering
   */
  getAllProducts(filters?: ProductFilters): Observable<Product[]> {
    let params = new HttpParams();
    
    if (filters?.category) {
      params = params.set('category', filters.category);
    }
    if (filters?.subCategory) {
      params = params.set('subCategory', filters.subCategory);
    }
    if (filters?.gender) {
      params = params.set('gender', filters.gender);
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    
    return this.http.get<any>(`${environment.baseUrl}products`, { params })
      .pipe(
        map(response => {
          // Handle both direct array and wrapped response
          return response.data || response;
        }),
        catchError(error => {
          console.error('Error fetching products:', error);
          return of([]);
        })
      );
  }

  /**
   * Search products by name for autocomplete
   */
  searchProducts(term: string): Observable<Product[]> {
    if (!term || term.length < 2) {
      return of([]);
    }
    
    return this.http.get<Product[]>(`${environment.baseUrl}products/search/${encodeURIComponent(term)}`)
      .pipe(
        map(response => {
          return response || [];
        }),
        catchError(error => {
          console.error('Error searching products:', error);
          return of([]);
        })
      );
  }

  /**
   * Get product by ID
   */
  getProductById(productId: number): Observable<Product | null> {
    return this.http.get<Product>(`${environment.baseUrl}products/${productId}`)
      .pipe(
        map(response => {
          return response || null;
        }),
        catchError(error => {
          console.error('Error fetching product by ID:', error);
          return of(null);
        })
      );
  }

  /**
   * Get all product categories
   */
  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${environment.baseUrl}products/categories`)
      .pipe(
        map(response => {
          return response || [];
        }),
        catchError(error => {
          console.error('Error fetching categories:', error);
          return of([]);
        })
      );
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.baseUrl}products/category/${encodeURIComponent(category)}`)
      .pipe(
        map(response => {
          return response || [];
        }),
        catchError(error => {
          console.error('Error fetching products by category:', error);
          return of([]);
        })
      );
  }

  /**
   * Utility method to format product display name
   */
  getProductDisplayName(product: Product): string {
    return `${product.productName} (${product.category} - ${product.subCategory})`;
  }

  /**
   * Create new product
   */
  createProduct(productData: Partial<Product>): Observable<Product> {
    return this.http.post<any>(`${environment.baseUrl}products`, productData)
      .pipe(
        map(response => {
          return response.data || response;
        }),
        catchError(error => {
          console.error('Error creating product:', error);
          throw error;
        })
      );
  }

  /**
   * Update existing product
   */
  updateProduct(productId: number, productData: Partial<Product>): Observable<Product> {
    return this.http.put<any>(`${environment.baseUrl}products/${productId}`, productData)
      .pipe(
        map(response => {
          return response.data || response;
        }),
        catchError(error => {
          console.error('Error updating product:', error);
          throw error;
        })
      );
  }

  /**
   * Validate if product exists and is active
   */
  validateProduct(productId: number): Observable<boolean> {
    return this.getProductById(productId).pipe(
      map(product => product !== null && product.isActive)
    );
  }

  /**
   * Check if product name already exists
   */
  checkProductNameExists(productName: string, excludeId?: number): Observable<boolean> {
    return this.getAllProducts({ search: productName }).pipe(
      map(products => {
        return products.some(p => 
          p.productName.toLowerCase() === productName.toLowerCase() && 
          p.productId !== excludeId
        );
      })
    );
  }
}