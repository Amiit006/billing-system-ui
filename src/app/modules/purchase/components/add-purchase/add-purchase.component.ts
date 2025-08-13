// src/app/modules/purchase/components/add-purchase/add-purchase.component.ts
// COMPLETE VERSION with existing + enhanced features

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable,of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { EnhancedPurchaseService } from '../../services/enhanced-purchase.service';
import { ProductService } from '../../services/product.service';
import { PurchaseService } from '../../services/purchase.service'; // Keep for backward compatibility
import { 
  Product, 
  PurchaseProduct, 
  EnhancedPurchaseRequest,
  OverheadCosts,
  PurchaseFormValidation 
} from '../../model/enhanced-purchase.model';
import { AddProductDialogComponent } from './add-product-dialog/add-product-dialog';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent implements OnInit {

  // Form and data properties
  purchaseForm: FormGroup;
  products: Product[] = [];
  filteredProductsOptions: Observable<Product[]>[] = []; // Array for each product row
  selectedSeason: any;
  maxDate = new Date();
  minDate = new Date();
  
  // Real-time calculations
  totalPurchaseAmount = 0;
  overheadCosts: OverheadCosts = {
    taxAmount: 0,
    packingCharge: 0,
    transportAmount: 0
  };

  // Form validation
  formValidation: PurchaseFormValidation = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Payment modes (existing)
  paymentModes = [
    { 'viewValue': 'Cash', 'value': 'cash' },
    { 'viewValue': 'Bank Transfer', 'value': 'bankTransfer' },
    { 'viewValue': 'Cheque', 'value': 'cheque' }
  ];

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private enhancedPurchaseService: EnhancedPurchaseService,
    private productService: ProductService,
    private purchaseService: PurchaseService, // Keep for compatibility
    private dialog: MatDialog
  ) {
    // Get selected season from navigation state
    this.selectedSeason = this.router.getCurrentNavigation()?.extras?.state?.selectedSeason;
    if (this.selectedSeason) {
      this.minDate = new Date(this.selectedSeason.startDate);
      this.maxDate = new Date(this.selectedSeason.endDate);
    }

    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadProducts();
    this.setupFormSubscriptions();
    this.addProduct(); // Add one initial product row
  }

  /**
   * Initialize the reactive form with enhanced structure
   */
  private initializeForm(): void {
    this.purchaseForm = this.fb.group({
      'partyName': ['', Validators.required],
      'purchaseDate': [new Date(), Validators.required],
      'purchaseProducts': this.fb.array([]), // Dynamic product array
      'packingCharge': [0, [Validators.required, Validators.min(0)]],
      'taxAmount': [0, [Validators.required, Validators.min(0)]],
      'taxPercent': [{ value: 0, disabled: true }],
      'discountAmount': [0, [Validators.required, Validators.min(0)]],
      'discountPercent': [{ value: 0, disabled: true }],
      'extraDiscountAmount': [0, [Validators.required, Validators.min(0)]],
      'transport': this.fb.group({
        'transportName': [''],
        'amount': [0, [Validators.min(0)]],
        'consignmentNumber': ['']
      }),
      'payments': this.fb.array([])
    });
  }

  /**
   * Setup form value change subscriptions for real-time calculations
   */
  private setupFormSubscriptions(): void {
    // Watch for changes in purchase products
    this.purchaseProducts.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.calculateTotals();
      this.validateForm();
    });

    // Watch for overhead cost changes
    this.purchaseForm.get('taxAmount')?.valueChanges.subscribe(() => this.calculateTotals());
    this.purchaseForm.get('packingCharge')?.valueChanges.subscribe(() => this.calculateTotals());
    this.purchaseForm.get('transport.amount')?.valueChanges.subscribe(() => this.calculateTotals());
  }

  /**
   * Load products from API
   */
  private loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.products = products;
        console.log('Products loaded:', products.length, 'items');
      },
      (error) => {
        console.error('Error loading products:', error);
        this.toastrService.error('Error loading products');
      }
    );
  }

  /**
   * Get purchase products FormArray
   */
  get purchaseProducts(): FormArray {
    return this.purchaseForm.get('purchaseProducts') as FormArray;
  }

  /**
   * Get payments FormArray (existing functionality)
   */
  get payments(): FormArray {
    return this.purchaseForm.get('payments') as FormArray;
  }

  /**
   * Create a new product FormGroup with autocomplete capabilities
   */
  private createProductFormGroup(): FormGroup {
    return this.fb.group({
      'productId': [null],
      'productName': ['', Validators.required], // Now required as user can type
      'productSearch': [''], // Search field for autocomplete
      'quantity': [0, [Validators.required, Validators.min(1)]],
      'ratePerUnit': [0, [Validators.required, Validators.min(0)]],
      'totalAmount': [{ value: 0, disabled: true }],
      // Calculated overhead allocation fields (read-only)
      'percentageOfPurchase': [{ value: 0, disabled: true }],
      'allocatedTax': [{ value: 0, disabled: true }],
      'allocatedTransport': [{ value: 0, disabled: true }],
      'allocatedPackingCharge': [{ value: 0, disabled: true }],
      'totalAllocatedOverhead': [{ value: 0, disabled: true }],
      'finalCostPerUnit': [{ value: 0, disabled: true }],
      // New product creation fields (hidden by default)
      'isNewProduct': [false],
      'category': [''],
      'subCategory': [''],
      'unit': ['pieces']
    });
  }

  /**
   * Add a new product row
   */
  addProduct(): void {
    const productGroup = this.createProductFormGroup();
    this.purchaseProducts.push(productGroup);
    
    const index = this.purchaseProducts.length - 1;
    
    // Setup product-specific subscriptions
    this.setupProductSubscriptions(index);
    
    // Setup autocomplete for this row
    this.setupAutocomplete(index);
  }

  /**
   * Remove a product row
   */
  removeProduct(index: number): void {
    if (this.purchaseProducts.length > 1) {
      this.purchaseProducts.removeAt(index);
      this.filteredProductsOptions.splice(index, 1);
      this.calculateTotals();
    } else {
      this.toastrService.warning('At least one product is required');
    }
  }

  /**
   * Setup autocomplete for product search
   */
  private setupAutocomplete(index: number): void {
    const productGroup = this.purchaseProducts.at(index) as FormGroup;
    const searchControl = productGroup.get('productSearch');
    
    if (searchControl) {
      const filteredProducts = searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          if (typeof value === 'string' && value.length >= 2) {
            return this.productService.searchProducts(value);
          } else {
            return of(this.products.slice(0, 10)); // Show first 10 products by default
          }
        })
      );
      
      // Ensure array is large enough
      while (this.filteredProductsOptions.length <= index) {
        this.filteredProductsOptions.push(of([]));
      }
      
      this.filteredProductsOptions[index] = filteredProducts;
    }
  }

  /**
   * Handle product selection from autocomplete
   */
  onProductSelected(event: MatAutocompleteSelectedEvent, index: number): void {
    const selectedProduct = event.option.value as Product;
    const productGroup = this.purchaseProducts.at(index) as FormGroup;
    
    if (selectedProduct && selectedProduct.productId) {
      // Existing product selected
      productGroup.patchValue({
        productId: selectedProduct.productId,
        productName: selectedProduct.productName,
        productSearch: this.getProductDisplayName(selectedProduct),
        isNewProduct: false,
        category: selectedProduct.category,
        subCategory: selectedProduct.subCategory,
        unit: selectedProduct.unit
      });
    }
  }

  /**
   * Handle manual product name entry (for new products)
   */
  onProductNameChange(index: number): void {
    const productGroup = this.purchaseProducts.at(index) as FormGroup;
    const searchValue = productGroup.get('productSearch')?.value;
    
    if (typeof searchValue === 'string' && searchValue.length > 0) {
      // Check if it's an existing product
      const existingProduct = this.products.find(p => 
        p.productName.toLowerCase() === searchValue.toLowerCase()
      );
      
      if (existingProduct) {
        // Found existing product
        this.onProductSelected({ option: { value: existingProduct } } as any, index);
      } else {
        // New product - mark for creation
        productGroup.patchValue({
          productId: null,
          productName: searchValue,
          isNewProduct: true
        });
      }
    }
  }

  /**
   * Open dialog to add new product with full details
   */
  openAddProductDialog(index: number): void {
    const productGroup = this.purchaseProducts.at(index) as FormGroup;
    const currentName = productGroup.get('productSearch')?.value || '';
    
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '600px',
      data: { 
        productName: currentName,
        categories: [] // You can load categories if needed
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        // New product created successfully
        const newProduct = result.product;
        this.products.push(newProduct); // Add to local array
        
        // Update the form with new product
        productGroup.patchValue({
          productId: newProduct.productId,
          productName: newProduct.productName,
          productSearch: this.getProductDisplayName(newProduct),
          isNewProduct: false,
          category: newProduct.category,
          subCategory: newProduct.subCategory,
          unit: newProduct.unit
        });
        
        this.toastrService.success('Product created successfully!');
      }
    });
  }

  /**
   * Setup subscriptions for individual product changes
   */
  private setupProductSubscriptions(index: number): void {
    const productGroup = this.purchaseProducts.at(index) as FormGroup;
    
    // Watch for quantity or rate changes to calculate total
    const quantityControl = productGroup.get('quantity');
    const rateControl = productGroup.get('ratePerUnit');
    
    [quantityControl, rateControl].forEach(control => {
      control?.valueChanges.pipe(debounceTime(300)).subscribe(() => {
        this.calculateProductTotal(index);
      });
    });

    // Watch for product search changes
    productGroup.get('productSearch')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.onProductNameChange(index);
    });
  }

  /**
   * Calculate total amount for a specific product
   */
  private calculateProductTotal(index: number): void {
    const productGroup = this.purchaseProducts.at(index) as FormGroup;
    const quantity = productGroup.get('quantity')?.value || 0;
    const rate = productGroup.get('ratePerUnit')?.value || 0;
    
    const total = this.enhancedPurchaseService.calculateProductTotal(quantity, rate);
    productGroup.get('totalAmount')?.setValue(total);
  }

  /**
   * Calculate all totals and overhead allocations
   */
  private calculateTotals(): void {
    // Get current product data
    const productsValue = this.purchaseProducts.getRawValue() as PurchaseProduct[];
    
    // Update overhead costs
    this.overheadCosts = {
      taxAmount: this.purchaseForm.get('taxAmount')?.value || 0,
      packingCharge: this.purchaseForm.get('packingCharge')?.value || 0,
      transportAmount: this.purchaseForm.get('transport.amount')?.value || 0
    };

    // Calculate total purchase amount
    this.totalPurchaseAmount = this.enhancedPurchaseService.calculateTotalPurchaseAmount(productsValue);

    // Calculate overhead allocation for each product
    const enhancedProducts = this.enhancedPurchaseService.calculateOverheadAllocation(
      productsValue,
      this.overheadCosts
    );

    // Update form with calculated values
    enhancedProducts.forEach((product, index) => {
      const productGroup = this.purchaseProducts.at(index) as FormGroup;
      productGroup.get('percentageOfPurchase')?.setValue(product.percentageOfPurchase);
      productGroup.get('allocatedTax')?.setValue(product.allocatedTax);
      productGroup.get('allocatedTransport')?.setValue(product.allocatedTransport);
      productGroup.get('allocatedPackingCharge')?.setValue(product.allocatedPackingCharge);
      productGroup.get('totalAllocatedOverhead')?.setValue(product.totalAllocatedOverhead);
      productGroup.get('finalCostPerUnit')?.setValue(product.finalCostPerUnit);
    });

    // Update tax and discount percentages
    this.updatePercentages();
  }

  /**
   * Update tax and discount percentages based on amounts
   */
  private updatePercentages(): void {
    if (this.totalPurchaseAmount > 0) {
      const taxPercent = ((this.overheadCosts.taxAmount / this.totalPurchaseAmount) * 100).toFixed(2);
      this.purchaseForm.get('taxPercent')?.setValue(taxPercent);

      const discountAmount = this.purchaseForm.get('discountAmount')?.value || 0;
      const discountPercent = ((discountAmount / (this.totalPurchaseAmount + this.overheadCosts.taxAmount)) * 100).toFixed(2);
      this.purchaseForm.get('discountPercent')?.setValue(discountPercent);
    }
  }

  /**
   * Validate the entire form including new products
   */
  private validateForm(): void {
    const productsValue = this.purchaseProducts.getRawValue() as PurchaseProduct[];
    this.formValidation = this.enhancedPurchaseService.validatePurchaseProducts(productsValue);
    
    // Additional validation for new products
    this.purchaseProducts.controls.forEach((control, index) => {
      const productGroup = control as FormGroup;
      const isNewProduct = productGroup.get('isNewProduct')?.value;
      const productName = productGroup.get('productName')?.value;
      
      if (isNewProduct && (!productName || productName.trim().length < 2)) {
        this.formValidation.errors.push({
          index,
          field: 'productName',
          message: 'Product name must be at least 2 characters'
        });
        this.formValidation.isValid = false;
      }
    });
  }

  /**
   * Get product display name for dropdown/autocomplete
   */
  getProductDisplayName(product: Product): string {
    return this.productService.getProductDisplayName(product);
  }

  /**
   * Check if product at index is new product
   */
  isNewProduct(index: number): boolean {
    const productGroup = this.purchaseProducts.at(index) as FormGroup;
    return productGroup.get('isNewProduct')?.value || false;
  }

  // ============================================
  // EXISTING PAYMENT FUNCTIONALITY (unchanged)
  // ============================================

  /**
   * Get payment FormGroup template (existing functionality)
   */
  getPayment(): FormGroup {
    return this.fb.group({
      'mode': ['cash'],
      'chequeNo': [''],
      'paymentDate': [new Date(), Validators.required],
      'remark': [''],
      'amount': [0, [Validators.required, Validators.min(0)]]
    });
  }

  /**
   * Add payment method (existing functionality)
   */
  addPayment(): void {
    const paymentGroup = this.getPayment();
    this.payments.push(paymentGroup);
    this.onChange('cash', this.payments.length - 1);
  }

  /**
   * Remove payment method (existing functionality)
   */
  removePayment(index: number): void {
    this.payments.removeAt(index);
  }

  /**
   * Handle payment mode change (existing functionality)
   */
  onChange(value: string, index: number): void {
    const paymentGroup = this.payments.at(index) as FormGroup;
    const chequeNoControl = paymentGroup.get('chequeNo');
    
    if (value === 'cheque') {
      chequeNoControl?.enable();
      chequeNoControl?.setValidators([Validators.required, Validators.min(1)]);
      chequeNoControl?.setErrors({ 'invalid': true });
    } else {
      chequeNoControl?.setValue('');
      chequeNoControl?.disable();
      chequeNoControl?.clearValidators();
    }
    chequeNoControl?.updateValueAndValidity();
  }

  // ============================================
  // TAX/DISCOUNT CALCULATION METHODS (existing)
  // ============================================

  /**
   * Handle tax amount change (existing functionality)
   */
  onTaxAmountChange(): void {
    console.log("Tax amount changed");
    const control = this.purchaseForm;
    const taxAmount = control.get("taxAmount")?.value || 0;
    
    if (this.totalPurchaseAmount > 0) {
      const taxPercent = ((taxAmount / this.totalPurchaseAmount) * 100).toFixed(2);
      control.get("taxPercent")?.setValue(taxPercent);
    }
  }

  /**
   * Handle discount amount change (existing functionality)
   */
  onDiscountAmountChange(): void {
    const control = this.purchaseForm;
    const discountAmount = control.get("discountAmount")?.value || 0;
    const taxAmount = control.get("taxAmount")?.value || 0;
    
    if (this.totalPurchaseAmount > 0) {
      const discountPercent = ((discountAmount / (this.totalPurchaseAmount + taxAmount)) * 100).toFixed(2);
      control.get("discountPercent")?.setValue(discountPercent);
    }
  }

  // ============================================
  // ENHANCED SAVE METHOD
  // ============================================

  /**
   * Enhanced save method with new product creation
   */
  async onSave(): Promise<void> {
    if (!this.formValidation.isValid) {
      this.toastrService.error('Please fix form errors before saving');
      return;
    }

    const seasonId = this.activeRoute.snapshot.paramMap.get('seasonId');
    if (!seasonId) {
      this.toastrService.error('Season ID is required');
      return;
    }

    try {
      // First, create any new products
      await this.createNewProducts();
      
      // Prepare enhanced purchase data
      const formValue = this.purchaseForm.getRawValue();
      const enhancedPurchaseData: EnhancedPurchaseRequest = {
        partyName: formValue.partyName,
        purchaseDate: formValue.purchaseDate,
        purchaseProducts: formValue.purchaseProducts.map(p => ({
          productId: p.productId,
          productName: p.productName,
          quantity: p.quantity,
          ratePerUnit: p.ratePerUnit,
          totalAmount: p.totalAmount
        })),
        packingCharge: formValue.packingCharge,
        taxAmount: formValue.taxAmount,
        taxPercent: formValue.taxPercent,
        discountAmount: formValue.discountAmount,
        discountPercent: formValue.discountPercent,
        extraDiscountAmount: formValue.extraDiscountAmount,
        transport: formValue.transport.transportName ? formValue.transport : undefined,
        payments: formValue.payments
      };

      // Use enhanced purchase service
      this.enhancedPurchaseService.createPurchaseWithProducts(seasonId, enhancedPurchaseData).subscribe(
        (response) => {
          this.toastrService.success('Purchase added successfully with product breakdown!');
          this.router.navigateByUrl(`/purchase/season/${seasonId}`, {
            state: { selectedSeason: this.selectedSeason }
          });
        },
        (error) => {
          console.error('Error saving purchase:', error);
          this.toastrService.error(error?.error?.message || 'Error while saving purchase!');
        }
      );
    } catch (error) {
      console.error('Error in save process:', error);
      this.toastrService.error('Error creating new products');
    }
  }

  /**
   * Create new products that don't exist yet
   */
  private async createNewProducts(): Promise<void> {
    const newProductPromises = [];
    
    for (let i = 0; i < this.purchaseProducts.length; i++) {
      const productGroup = this.purchaseProducts.at(i) as FormGroup;
      const isNewProduct = productGroup.get('isNewProduct')?.value;
      
      if (isNewProduct) {
        const productData = {
          productName: productGroup.get('productName')?.value,
          category: productGroup.get('category')?.value || 'Tops',
          subCategory: productGroup.get('subCategory')?.value || 'Shirts',
          unit: productGroup.get('unit')?.value || 'pieces',
          gender: 'Men'
        };
        
        const promise = this.productService.createProduct(productData).toPromise()
          .then(newProduct => {
            // Update the form with the new product ID
            productGroup.patchValue({
              productId: newProduct.productId,
              isNewProduct: false
            });
            
            // Add to local products array
            this.products.push(newProduct);
            
            return newProduct;
          });
          
        newProductPromises.push(promise);
      }
    }
    
    if (newProductPromises.length > 0) {
      await Promise.all(newProductPromises);
      this.toastrService.success(`${newProductPromises.length} new product(s) created!`);
    }
  }
  onCancel(): void {
    this.router.navigateByUrl(`/purchase/season/${this.activeRoute.snapshot.paramMap.get('seasonId')}`, {
      state: { selectedSeason: this.selectedSeason }
    });
  }
}