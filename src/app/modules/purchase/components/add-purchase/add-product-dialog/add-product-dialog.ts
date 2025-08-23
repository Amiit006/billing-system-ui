// src/app/modules/purchase/components/add-purchase/add-product-dialog/add-product-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
interface DialogData {
  productName: string;
  categories: any[];
}

@Component({
  selector: 'app-add-product-dialog',
  template: `
    <h2 mat-dialog-title>Add New Product</h2>
    
    <mat-dialog-content>
      <form [formGroup]="productForm" class="product-form">
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Product Name *</mat-label>
          <input matInput formControlName="productName" placeholder="Enter product name">
          <mat-error *ngIf="productForm.get('productName')?.hasError('required')">
            Product name is required
          </mat-error>
          <mat-error *ngIf="productForm.get('productName')?.hasError('minlength')">
            Product name must be at least 2 characters
          </mat-error>
          <mat-error *ngIf="productForm.get('productName')?.hasError('nameExists')">
            Product name already exists
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Category *</mat-label>
            <mat-select formControlName="category" (selectionChange)="onCategoryChange($event.value)">
              <mat-option value="Bottoms">Bottoms</mat-option>
              <mat-option value="Tops">Tops</mat-option>
              <mat-option value="Winter Products">Winter Products</mat-option>
            </mat-select>
            <mat-error *ngIf="productForm.get('category')?.hasError('required')">
              Category is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Sub Category *</mat-label>
            <mat-select formControlName="subCategory">
              <mat-option *ngFor="let subCat of availableSubCategories" [value]="subCat">
                {{subCat}}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="productForm.get('subCategory')?.hasError('required')">
              Sub category is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Unit</mat-label>
            <mat-select formControlName="unit">
              <mat-option value="pieces">Pieces</mat-option>
              <mat-option value="kg">Kilograms</mat-option>
              <mat-option value="meters">Meters</mat-option>
              <mat-option value="pairs">Pairs</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Gender</mat-label>
            <mat-select formControlName="gender">
              <mat-option value="Men">Men</mat-option>
              <mat-option value="Women">Women</mat-option>
              <mat-option value="Unisex">Unisex</mat-option>
              <mat-option value="Kids">Kids</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div *ngIf="isCreating" class="creating-indicator">
          <mat-spinner diameter="20"></mat-spinner>
          <span>Creating product...</span>
        </div>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="productForm.invalid || isCreating"
              (click)="onSave()">
        Create Product
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .product-form {
      min-width: 500px;
      padding: 20px 0;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    
    .form-row {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .half-width {
      flex: 1;
    }
    
    .creating-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 15px;
      color: #666;
    }
    
    mat-dialog-content {
      max-height: 500px;
      overflow-y: auto;
    }
  `]
})
export class AddProductDialogComponent implements OnInit {

  productForm: FormGroup;
  isCreating = false;
  
  // Category to subcategory mapping
  categorySubcategories = {
    'Tops': ['Shirts', 'T-Shirts', 'Polo', 'Formal Shirts', 'Casual Shirts'],
    'Bottoms': ['Jeans', 'Trousers', 'Shorts', 'Formal Pants', 'Casual Pants'],
    'Winter Products': ['Jackets', 'Sweaters', 'Hoodies', 'Coats', 'Thermals']
  };
  
  availableSubCategories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Set default subcategories for Tops
    this.availableSubCategories = this.categorySubcategories['Tops'];
    
    // Set initial product name if provided
    if (this.data.productName) {
      this.productForm.patchValue({
        productName: this.data.productName
      });
    }
    
    // Setup async validation for product name
    this.setupAsyncValidation();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      productName: ['', [
        Validators.required, 
        Validators.minLength(2)
      ]],
      category: ['Tops', Validators.required],
      subCategory: ['Shirts', Validators.required],
      unit: ['pieces'],
      gender: ['Men']
    });
  }

  private setupAsyncValidation(): void {
    const productNameControl = this.productForm.get('productName');
    
    productNameControl?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      if (value && value.length >= 2) {
        this.productService.checkProductNameExists(value).subscribe(exists => {
          if (exists) {
            productNameControl.setErrors({ nameExists: true });
          } else {
            const currentErrors = productNameControl.errors;
            if (currentErrors) {
              delete currentErrors['nameExists'];
              const hasOtherErrors = Object.keys(currentErrors).length > 0;
              productNameControl.setErrors(hasOtherErrors ? currentErrors : null);
            }
          }
        });
      }
    });
  }

  onCategoryChange(category: string): void {
    this.availableSubCategories = this.categorySubcategories[category] || [];
    
    // Reset subcategory to first available option
    if (this.availableSubCategories.length > 0) {
      this.productForm.patchValue({
        subCategory: this.availableSubCategories[0]
      });
    }
  }

  onSave(): void {
    if (this.productForm.valid && !this.isCreating) {
      this.isCreating = true;
      
      const productData = this.productForm.value;
      
      this.productService.createProduct(productData).subscribe(
        (newProduct) => {
          this.isCreating = false;
          this.toastrService.success('Product created successfully!');
          
          this.dialogRef.close({
            success: true,
            product: newProduct
          });
        },
        (error) => {
          this.isCreating = false;
          console.error('Error creating product:', error);
          
          // Handle specific error messages
          let errorMessage = 'Error creating product';
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          
          this.toastrService.error(errorMessage);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close({
      success: false
    });
  }
}

// Add these imports at the top
