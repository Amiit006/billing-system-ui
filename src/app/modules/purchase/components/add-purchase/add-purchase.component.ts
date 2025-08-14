// src/app/modules/purchase/components/add-purchase/add-purchase.component.ts
// Following the proven billing component pattern

import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { ProductService } from '../../services/product.service';
import { PurchaseService } from '../../services/purchase.service';
import { Product } from '../../model/enhanced-purchase.model';
import { AddProductDialogComponent } from './add-product-dialog/add-product-dialog';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent implements OnInit {

  slNoCount = 0;
  selectedSeason: any;
  maxDate = new Date();
  minDate = new Date();
  
  // Products and calculations
  products: Product[] = [];
  totalPurchaseAmount = 0;
  grandTotal = 0;

  // Payment modes
  paymentModes = [
    { 'viewValue': 'Cash', 'value': 'cash' },
    { 'viewValue': 'Bank Transfer', 'value': 'bankTransfer' },
    { 'viewValue': 'Cheque', 'value': 'cheque' }
  ];

  @ViewChildren('inputToFocus') set inputF(inputF: QueryList<ElementRef>) {
    const inputToFocus = inputF.filter(x => x?.nativeElement.value === "");
    if (inputToFocus.length > 0) {
      inputToFocus[0].nativeElement.focus();
    }
    this.cdRef.detectChanges();
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private cdRef: ChangeDetectorRef,
    private productService: ProductService,
    private purchaseService: PurchaseService,
    private dialog: MatDialog
  ) {
    // Get selected season from navigation state
    this.selectedSeason = this.router.getCurrentNavigation()?.extras?.state?.selectedSeason;
    if (this.selectedSeason) {
      this.minDate = new Date(this.selectedSeason.startDate);
      this.maxDate = new Date(this.selectedSeason.endDate);
    }
  }

  ngOnInit(): void {
    this.loadProducts();
    this.purchaseForm.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
    
    // Debug: Check if products are loaded
    setTimeout(() => {
      console.log('Products loaded:', this.products);
    }, 2000);
  }

  /**
   * Load products for autocomplete
   */
  loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.products = products || [];
        console.log('Products loaded:', this.products.length, 'items');
      },
      (error) => {
        console.error('Error loading products:', error);
        this.toastrService.error('Error loading products');
      }
    );
  }

  /**
   * Main purchase form following billing pattern
   */
  purchaseForm = this.fb.group({
    // Basic purchase info
    partyName: ['', Validators.required],
    purchaseDate: [new Date(), Validators.required],
    
    // Product items array
    items: this.fb.array([this.createProductFormGroup()]),
    
    // Overhead costs
    packingCharge: [0, [Validators.min(0)]],
    taxAmount: [0, [Validators.min(0)]],
    taxPercent: [{ value: 0, disabled: true }],
    discountAmount: [0, [Validators.min(0)]],
    discountPercent: [{ value: 0, disabled: true }],
    extraDiscountAmount: [0, [Validators.min(0)]],
    
    // Transport details
    transport: this.fb.group({
      transportName: [''],
      amount: [0, [Validators.min(0)]],
      consignmentNumber: ['']
    }),
    
    // Payments array
    payments: this.fb.array([])
  });

  /**
   * Create product form group (similar to addbillFormGroup)
   */
  createProductFormGroup(): FormGroup {
    this.slNoCount += 1;
    return this.fb.group({
      slNo: [{ value: this.slNoCount, disabled: true }],
      productId: [null],
      productName: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      ratePerUnit: [0, [Validators.required, Validators.min(0)]],
      total: [{ value: 0, disabled: true }],
      
      // Calculated overhead allocation fields
      percentageOfPurchase: [{ value: 0, disabled: true }],
      allocatedTax: [{ value: 0, disabled: true }],
      allocatedTransport: [{ value: 0, disabled: true }],
      allocatedPackingCharge: [{ value: 0, disabled: true }],
      totalAllocatedOverhead: [{ value: 0, disabled: true }],
      finalCostPerUnit: [{ value: 0, disabled: true }],
      
      // Product details
      category: [''],
      subCategory: [''],
      unit: ['pieces'],
      isNewProduct: [false]
    });
  }

  /**
   * Get items FormArray
   */
  get items(): FormArray {
    return this.purchaseForm.get('items') as FormArray;
  }

  /**
   * Get payments FormArray
   */
  get payments(): FormArray {
    return this.purchaseForm.get('payments') as FormArray;
  }

  /**
   * Add new product row
   */
  addRow(): void {
    this.items.push(this.createProductFormGroup());
  }

  /**
   * Remove product row with undo functionality
   */
  removeRow(index: number): void {
    if (this.items.length === 1) {
      this.toastrService.warning('At least one product is required');
      return;
    }

    const tempRow = this.items.at(index);
    this.items.removeAt(index);
    this.reassignSlNo();
    this.cdRef.detectChanges();

    // Show undo option
    const toastRef = this.toastrService.info('Product removed', 'Undo', {
      timeOut: 3000,
      tapToDismiss: false,
      closeButton: true
    });

    // Handle undo action
    toastRef.onTap.subscribe(() => {
      this.items.insert(index, tempRow);
      this.reassignSlNo();
      this.cdRef.detectChanges();
      this.toastrService.clear();
    });
  }

  /**
   * Reassign serial numbers
   */
  reassignSlNo(): void {
    let value = 1;
    this.items.controls.forEach(control => {
      control.get('slNo')?.setValue(value);
      value += 1;
    });
    this.slNoCount = value - 1;
  }

  /**
   * Product search function for ngbTypeahead
   */
  searchProducts: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => {
        console.log('Search term:', term, 'Products available:', this.products.length);
        
        if (term.length < 2) {
          return [];
        }
        
        const filtered = this.products
          .filter(p => p.productName.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .map(p => p.productName)
          .slice(0, 10);
          
        console.log('Filtered results:', filtered);
        return filtered;
      })
    );

  /**
   * Test search function (simplified)
   */
  testSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => {
        console.log('Test search called with:', term);
        return term.length < 2 ? [] : ['Test Product 1', 'Test Product 2', 'Test Product 3'];
      })
    );

  /**
   * Input formatter for ngbTypeahead
   */
  inputFormatter = (value: string) => value;

  /**
   * Result template for ngbTypeahead
   */
  resultTemplate = (result: string) => result;

  /**
   * Handle product selection
   */
  onProductSelected(event: any, index: number): void {
    const selectedProductName = event.item;
    const selectedProduct = this.products.find(p => p.productName === selectedProductName);
    
    if (selectedProduct) {
      const productControl = this.items.at(index);
      productControl.patchValue({
        productId: selectedProduct.productId,
        productName: selectedProduct.productName,
        category: selectedProduct.category,
        subCategory: selectedProduct.subCategory,
        unit: selectedProduct.unit,
        isNewProduct: false
      });
    } else {
      // Mark as new product if not found
      const productControl = this.items.at(index);
      productControl.patchValue({
        productId: null,
        productName: selectedProductName,
        isNewProduct: true
      });
    }
  }

  /**
   * Handle quantity change
   */
  onQuantityChange(index: number): void {
    this.calculateProductTotal(index);
  }

  /**
   * Handle rate change
   */
  onRateChange(index: number): void {
    this.calculateProductTotal(index);
  }

  /**
   * Calculate individual product total
   */
  calculateProductTotal(index: number): void {
    const productControl = this.items.at(index);
    const quantity = productControl.get('quantity')?.value || 0;
    const rate = productControl.get('ratePerUnit')?.value || 0;
    const total = quantity * rate;
    
    productControl.get('total')?.setValue(total);
    this.calculateTotals();
  }

  /**
   * Calculate all totals and overhead allocation
   */
  calculateTotals(): void {
    // Calculate total purchase amount
    this.totalPurchaseAmount = 0;
    this.items.controls.forEach(control => {
      this.totalPurchaseAmount += control.get('total')?.value || 0;
    });

    // Get overhead costs
    const taxAmount = this.purchaseForm.get('taxAmount')?.value || 0;
    const packingCharge = this.purchaseForm.get('packingCharge')?.value || 0;
    const transportAmount = this.purchaseForm.get('transport.amount')?.value || 0;
    const totalOverhead = taxAmount + packingCharge + transportAmount;

    // Calculate overhead allocation for each product
    this.items.controls.forEach(control => {
      const productTotal = control.get('total')?.value || 0;
      const quantity = control.get('quantity')?.value || 0;
      
      if (this.totalPurchaseAmount > 0) {
        const percentage = (productTotal / this.totalPurchaseAmount) * 100;
        const allocatedTax = (taxAmount * productTotal) / this.totalPurchaseAmount;
        const allocatedPacking = (packingCharge * productTotal) / this.totalPurchaseAmount;
        const allocatedTransport = (transportAmount * productTotal) / this.totalPurchaseAmount;
        const totalAllocatedOverhead = allocatedTax + allocatedPacking + allocatedTransport;
        const finalCostPerUnit = quantity > 0 ? (productTotal + totalAllocatedOverhead) / quantity : 0;

        control.patchValue({
          percentageOfPurchase: Math.round(percentage * 100) / 100,
          allocatedTax: Math.round(allocatedTax * 100) / 100,
          allocatedPackingCharge: Math.round(allocatedPacking * 100) / 100,
          allocatedTransport: Math.round(allocatedTransport * 100) / 100,
          totalAllocatedOverhead: Math.round(totalAllocatedOverhead * 100) / 100,
          finalCostPerUnit: Math.round(finalCostPerUnit * 100) / 100
        });
      }
    });

    // Calculate grand total
    const discountAmount = this.purchaseForm.get('discountAmount')?.value || 0;
    const extraDiscountAmount = this.purchaseForm.get('extraDiscountAmount')?.value || 0;
    this.grandTotal = this.totalPurchaseAmount + totalOverhead - discountAmount - extraDiscountAmount;

    // Update percentage fields
    this.updatePercentages();
  }

  /**
   * Update tax and discount percentages
   */
  updatePercentages(): void {
    if (this.totalPurchaseAmount > 0) {
      const taxAmount = this.purchaseForm.get('taxAmount')?.value || 0;
      const taxPercent = (taxAmount / this.totalPurchaseAmount) * 100;
      this.purchaseForm.get('taxPercent')?.setValue(Math.round(taxPercent * 100) / 100);

      const discountAmount = this.purchaseForm.get('discountAmount')?.value || 0;
      const discountPercent = (discountAmount / (this.totalPurchaseAmount + taxAmount)) * 100;
      this.purchaseForm.get('discountPercent')?.setValue(Math.round(discountPercent * 100) / 100);
    }
  }

  /**
   * Open dialog to create new product
   */
  openAddProductDialog(index: number): void {
    const productControl = this.items.at(index);
    const currentName = productControl.get('productName')?.value || '';
    
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '600px',
      data: { 
        productName: currentName,
        categories: []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        const newProduct = result.product;
        this.products.push(newProduct);
        
        productControl.patchValue({
          productId: newProduct.productId,
          productName: newProduct.productName,
          category: newProduct.category,
          subCategory: newProduct.subCategory,
          unit: newProduct.unit,
          isNewProduct: false
        });
        
        this.toastrService.success('Product created successfully!');
      }
    });
  }

  /**
   * Check if product is new
   */
  isNewProduct(index: number): boolean {
    return this.items.at(index).get('isNewProduct')?.value || false;
  }

  // ============================================
  // PAYMENT METHODS
  // ============================================

  /**
   * Create payment form group
   */
  createPaymentFormGroup(): FormGroup {
    return this.fb.group({
      mode: ['cash'],
      chequeNo: [''],
      paymentDate: [new Date(), Validators.required],
      remark: [''],
      amount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  /**
   * Add payment
   */
  addPayment(): void {
    const paymentGroup = this.createPaymentFormGroup();
    this.payments.push(paymentGroup);
    this.onPaymentModeChange('cash', this.payments.length - 1);
  }

  /**
   * Remove payment
   */
  removePayment(index: number): void {
    this.payments.removeAt(index);
  }

  /**
   * Handle payment mode change
   */
  onPaymentModeChange(value: string, index: number): void {
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
  // SAVE AND NAVIGATION
  // ============================================

  /**
   * Save purchase
   */
  async onSave(): Promise<void> {
    if (this.purchaseForm.invalid) {
      this.toastrService.error('Please fill all required fields');
      return;
    }

    const seasonId = this.activeRoute.snapshot.paramMap.get('seasonId');
    if (!seasonId) {
      this.toastrService.error('Season ID is required');
      return;
    }

    try {
      // Create new products first
      await this.createNewProducts();

      // Prepare purchase data
      const formValue = this.purchaseForm.getRawValue();
      const purchaseData = {
        partyName: formValue.partyName,
        purchaseDate: formValue.purchaseDate,
        purchaseProducts: formValue.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          ratePerUnit: item.ratePerUnit,
          totalAmount: item.total
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

      // Save purchase
      this.purchaseService.createPurchase(seasonId, purchaseData).subscribe(
        (response) => {
          this.toastrService.success('Purchase saved successfully!');
          this.onCancel();
        },
        (error) => {
          console.error('Error saving purchase:', error);
          this.toastrService.error('Error saving purchase');
        }
      );
    } catch (error) {
      console.error('Error in save process:', error);
      this.toastrService.error('Error creating new products');
    }
  }

  /**
   * Create new products
   */
  private async createNewProducts(): Promise<void> {
    const newProductPromises = [];
    
    for (let i = 0; i < this.items.length; i++) {
      const productControl = this.items.at(i);
      const isNewProduct = productControl.get('isNewProduct')?.value;
      
      if (isNewProduct) {
        const productData = {
          productName: productControl.get('productName')?.value,
          category: productControl.get('category')?.value || 'Tops',
          subCategory: productControl.get('subCategory')?.value || 'Shirts',
          unit: productControl.get('unit')?.value || 'pieces',
          gender: 'Men'
        };
        
        const promise = this.productService.createProduct(productData).toPromise()
          .then(newProduct => {
            productControl.patchValue({
              productId: newProduct.productId,
              isNewProduct: false
            });
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

  /**
   * Cancel and go back
   */
  onCancel(): void {
    const seasonId = this.activeRoute.snapshot.paramMap.get('seasonId');
    this.router.navigateByUrl(`/purchase/season/${seasonId}`, {
      state: { selectedSeason: this.selectedSeason }
    });
  }
}