// src/app/modules/purchase/components/add-purchase/add-purchase.component.ts
// Updated version with better UX and mobile support

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
  totalOverhead = 0;
  grandTotal = 0;
  
  mode: 'add' | 'edit' | 'view' = 'add';
  purchaseId?: number;
  loading = false;

  /**
   * Main purchase form following billing pattern
   */
  purchaseForm = this.fb.group({
    // Basic purchase info
    partyName: ['', Validators.required],
    purchaseDate: [new Date(), Validators.required],
    purchaseAmount: [{ value: 0, disabled: true }],
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

  // Track field interactions for better UX
  private fieldTouched = new Set<string>();
  private fieldValues = new Map<string, any>();
  
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
    // Retrieve selectedSeason from navigation state or localStorage fallback
    const navState = this.router.getCurrentNavigation()?.extras?.state;
    if (navState && navState.selectedSeason) {
      this.selectedSeason = navState.selectedSeason;
      localStorage.setItem('selectedSeason', JSON.stringify(this.selectedSeason)); // cache it
    } else {
      // fallback: retrieve from localStorage
      const cached = localStorage.getItem('selectedSeason');
      if (cached) {
        this.selectedSeason = JSON.parse(cached);
      }
    }

    // now set date bounds safely
    if (this.selectedSeason) {
      this.minDate = new Date(this.selectedSeason.startDate);
      this.maxDate = new Date(this.selectedSeason.endDate);
    }
  }

  ngOnInit(): void {
    this.loadProducts();
    this.purchaseForm.valueChanges.pipe(debounceTime(50)).subscribe(() => this.calculateTotals());

    this.setupFormSubscriptions();
    // Read query params (mode, purchaseId) — we support route-based opening
    this.activeRoute.queryParams.subscribe(params => {
      if (params.mode) {
        this.mode = params.mode;
      }
      if (params.purchaseId) {
        this.purchaseId = +params.purchaseId;
      }

      if (this.mode === 'view' && this.purchaseId) {
        this.loadAndLock(this.purchaseId);
      } 
      // else leave as add
    });
  }

  loadAndLock(purchaseId: number): void {
    this.loading = true;
    this.purchaseService.getPurchaseWithProducts(purchaseId).subscribe(
      (resp: any) => {
        this.loading = false;
        const dto = (resp && resp.data) ? resp.data : resp;

        // Reset items and slNoCount so createProductFormGroup assigns correct slNo
        this.slNoCount = 0;
        const itemsArray = this.items;
        itemsArray.clear();

        // Top-level fields - adapt keys if your DTO uses different names
        this.purchaseForm.patchValue({
          partyName: dto.partyName || dto.party || '',
          purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : (dto.purchaseDateString ? new Date(dto.purchaseDateString) : this.purchaseForm.get('purchaseDate')?.value),
          packingCharge: dto.packingCharges ?? dto.packingCharge ?? this.purchaseForm.get('packingCharge')?.value,
          taxAmount: dto.taxAmount ?? dto.tax ?? this.purchaseForm.get('taxAmount')?.value,
          discountAmount: dto.discountAmount ?? dto.discount ?? this.purchaseForm.get('discountAmount')?.value,
          extraDiscountAmount: dto.extraDiscountAmount ?? dto.extraDisc ?? this.purchaseForm.get('extraDiscountAmount')?.value,
          // final amount not stored directly, will be computed
        });

        // Transport - adapt keys if needed
        if (dto.transport) {
          this.purchaseForm.get('transport')?.patchValue({
            transportName: dto.transport.transportName || dto.transportName || '',
            amount: dto.transport.transportAmount ?? dto.transport.amount ?? 0,
            consignmentNumber: dto.transport.consignmentNo ?? dto.transport.consignmentNumber ?? ''
          });
        }

        // Items/products: DTO may provide items under different keys - try common ones
        const productsArray = dto.items || dto.products || dto.purchaseProducts || dto.purchase_items || [];
        (productsArray as any[]).forEach(p => {
          const fg = this.createProductFormGroup();
          // patch values - adapt field names used by your backend
          fg.patchValue({
            productId: p.productId ?? p.id ?? p.product_id ?? null,
            productName: p.productName ?? p.name ?? p.product_name ?? '',
            quantity: p.quantity ?? p.qty ?? 0,
            ratePerUnit: p.ratePerUnit ?? p.rate ?? p.unitPrice ?? 0,
            total: p.totalAmount ?? p.total ?? ( (p.quantity ?? 0) * (p.ratePerUnit ?? p.rate ?? p.unitPrice ?? 0) ),
            category: p.category ?? '',
            subCategory: p.subCategory ?? p.sub_category ?? '',
            unit: p.unit ?? p.uom ?? 'pieces',
            isNewProduct: false
          });

          // optional: if DTO includes precomputed allocation fields set them too
          if (p.percentageOfPurchase !== undefined) {
            fg.patchValue({
              percentageOfPurchase: p.percentageOfPurchase,
              allocatedTax: p.allocatedTax,
              allocatedPackingCharge: p.allocatedPackingCharge,
              allocatedTransport: p.allocatedTransport,
              totalAllocatedOverhead: p.totalAllocatedOverhead,
              finalCostPerUnit: p.finalCostPerUnit
            });
          }

          itemsArray.push(fg);
        });

        // Payments (if any)
        const paymentsArray = this.payments;
        paymentsArray.clear();
        const dtoPayments = dto.payments || dto.purchasePayments || dto.paymentsList || [];
        (dtoPayments as any[]).forEach(pay => {
          const pg = this.createPaymentFormGroup();
          pg.patchValue({
            mode: pay.mode ?? 'cash',
            chequeNo: pay.chequeNo ?? pay.chequeNo ?? '',
            paymentDate: pay.paymentDate ? new Date(pay.paymentDate) : new Date(),
            remark: pay.remark ?? '',
            amount: pay.amount ?? pay.paymentAmount ?? 0
          });
          // Disable individual payment fields because whole form will be disabled later
          paymentsArray.push(pg);
        });

        // Recalculate totals to update UI values
        this.calculateTotals();

        // Finally make the form read-only
        this.purchaseForm.disable();

      },
      (err) => {
        this.loading = false;
        console.error('Error loading purchase with products', err);
        this.toastrService.error('Failed to load purchase details');
      }
    );
  }

  /**
   * Setup form value change subscriptions for real-time calculations
   */
  private setupFormSubscriptions(): void {
    // Watch for overhead cost changes
    this.purchaseForm.get('taxAmount')?.valueChanges.subscribe(() => this.calculateTotals());
    this.purchaseForm.get('discountAmount')?.valueChanges.subscribe(() => this.calculateTotals());
    this.purchaseForm.get('extraDiscountAmount')?.valueChanges.subscribe(() => this.calculateTotals());
    this.purchaseForm.get('packingCharge')?.valueChanges.subscribe(() => this.calculateTotals());
    this.purchaseForm.get('transport.amount')?.valueChanges.subscribe(() => this.calculateTotals());
    
    // Watch for discount percentage changes and calculate discount amount
    this.purchaseForm.get('discountPercent')?.valueChanges.subscribe((percent) => {
      if (this.fieldTouched.has('discountPercent') && percent !== null && percent !== undefined) {
        this.calculateDiscountFromPercent(percent);
      }
    });
  }

  /**
   * Load products for typeahead
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
   * Handle discount percent field interactions
   */
  onDiscountPercentFocus(event: any): void {
    this.fieldTouched.add('discountPercent');
    this.selectFieldContent(event);
  }

  onDiscountPercentDoubleClick(): void {
    const discountPercentControl = this.purchaseForm.get('discountPercent');
    if (discountPercentControl) {
      discountPercentControl.enable();  
    }
  }

  onDiscountPercentBlur(): void {
    const discountPercentControl = this.purchaseForm.get('discountPercent');
    if (discountPercentControl) {
      discountPercentControl.disable();
    }
  }

  /**
   * Calculate discount amount from percentage
   */
  private calculateDiscountFromPercent(percent: number): void {
    if (percent > 0 && this.totalPurchaseAmount > 0) {
      const taxAmount = this.purchaseForm.get('taxAmount')?.value || 0;
      const baseAmount = this.totalPurchaseAmount + taxAmount;
      const discountAmount = Math.ceil((baseAmount * percent) / 100); // Round up to next integer
      
      this.purchaseForm.get('discountAmount')?.setValue(discountAmount, { emitEvent: false });
      this.calculateTotals();
    }
  }

  /**
   * Handle field focus for better UX
   */
  onFieldFocus(event: any, fieldName: string): void {
    this.fieldTouched.add(fieldName);
    this.selectFieldContent(event);
  }

  /**
   * Select all content when focusing on number fields
   */
  private selectFieldContent(event: any): void {
    // Only select content if field has default value (0) and hasn't been changed by user
    const target = event.target;
    const currentValue = target.value;
    
    if (currentValue === '0' || currentValue === 0) {
      setTimeout(() => {
        target.select();
      }, 0);
    }
  }

  /**
   * Check if field has been touched for validation display
   */
  isFieldTouched(fieldName: string): boolean {
    return this.fieldTouched.has(fieldName);
  }

  /**
   * Check if item field has been touched
   */
  isItemFieldTouched(index: number, fieldName: string): boolean {
    return this.fieldTouched.has(`item_${index}_${fieldName}`);
  }

  /**
   * Handle item field focus
   */
  onItemFieldFocus(event: any, index: number, fieldName: string): void {
    this.fieldTouched.add(`item_${index}_${fieldName}`);
    this.selectFieldContent(event);
  }

  /**
   * Create product form group (similar to billing addbillFormGroup)
   */
  createProductFormGroup(): FormGroup {
    this.slNoCount += 1;
    return this.fb.group({
      slNo: [{ value: this.slNoCount, disabled: true }],
      productId: [null],
      productName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]], // Start with 1 instead of 0
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
    if (this.mode === 'view') {
      return; // do nothing in view mode
    }
    this.items.push(this.createProductFormGroup());
  }

  /**
   * Remove product row with undo functionality
   */
  removeRow(index: number): void {
    if (this.mode === 'view') {
      return; // do nothing in view mode
    }
    if (this.items.length === 1) {
      this.toastrService.warning('At least one product is required');
      return;
    }

    const tempRow = this.items.at(index);
    this.items.removeAt(index);
    this.reassignSlNo();
    
    // Remove touched state for this row
    this.cleanupFieldTouchedState(index);
    
    this.cdRef.detectChanges();

    // Show undo option using toastr
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
   * Clean up touched state when removing rows
   */
  private cleanupFieldTouchedState(removedIndex: number): void {
    const keysToRemove = Array.from(this.fieldTouched).filter(key => 
      key.startsWith(`item_${removedIndex}_`)
    );
    keysToRemove.forEach(key => this.fieldTouched.delete(key));
    
    // Update indices for remaining items
    const keysToUpdate = Array.from(this.fieldTouched).filter(key => 
      key.match(/^item_(\d+)_/) && parseInt(key.split('_')[1]) > removedIndex
    );
    
    keysToUpdate.forEach(key => {
      this.fieldTouched.delete(key);
      const parts = key.split('_');
      const oldIndex = parseInt(parts[1]);
      const newKey = `item_${oldIndex - 1}_${parts[2]}`;
      this.fieldTouched.add(newKey);
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
   * Product search function for ngbTypeahead (same as billing pattern)
   */
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.products
          .filter(p => p.productName.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .map(p => p.productName)
          .slice(0, 10))
    );

  /**
   * Handle product selection (same as billing selectedItem)
   */
  selectedItem(event: any, index: number): void {
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
   * Handle quantity change (same as billing pattern)
   */
  onQuantityChange(index: number): void {
    this.calculateAndPopulateTotal(index);
  }

  /**
   * Handle rate change (same as billing pattern)
   */
  onRateChange(index: number): void {
    this.calculateAndPopulateTotal(index);
  }

  /**
   * Calculate individual product total (same as billing pattern)
   */
  calculateAndPopulateTotal(index: number): void {
    const quantity = this.purchaseForm.get("items").value[index]["quantity"];
    const ratePerUnit = this.purchaseForm.get("items").value[index]["ratePerUnit"];
    const total = quantity * ratePerUnit;
    
    (<FormArray>this.purchaseForm.get("items")).controls[index].get("total").setValue(total);
    this.calculateTotals();
  }

  /**
   * Calculate all totals and overhead allocation
   * NOTE: use emitEvent:false when writing back to form to avoid infinite loops with valueChanges
   */
  calculateTotals(): void {
    // Prevent running while we are loading data or when in view-only mode
    if (this.loading) return;

    // Calculate total purchase amount
    let newTotalPurchaseAmount = 0;
    this.items.controls.forEach(control => {
      newTotalPurchaseAmount += control.get('total')?.value || 0;
    });

    this.totalPurchaseAmount = newTotalPurchaseAmount;

    // Get overhead costs (reading only)
    const taxAmount = this.purchaseForm.get('taxAmount')?.value || 0;
    const packingCharge = this.purchaseForm.get('packingCharge')?.value || 0;
    const transportAmount = this.purchaseForm.get('transport.amount')?.value || 0;
    const discountAmount = this.purchaseForm.get('discountAmount')?.value || 0;
    const extraDiscountAmount = this.purchaseForm.get('extraDiscountAmount')?.value || 0;

    const newTotalOverhead = taxAmount + packingCharge + transportAmount - discountAmount - extraDiscountAmount;
    this.totalOverhead = newTotalOverhead;

    // Calculate grand total (including discounts)
    this.grandTotal = this.totalPurchaseAmount + this.totalOverhead;

    // Update purchaseAmount control without emitting events
    const purchaseAmountControl = this.purchaseForm.get('purchaseAmount');
    if (purchaseAmountControl) {
      purchaseAmountControl.setValue(this.totalPurchaseAmount, { emitEvent: false });
    }

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

        // Calculate final cost per unit (after discounts)
        const productShare = productTotal / this.totalPurchaseAmount;
        const allocatedDiscount = (discountAmount + extraDiscountAmount) * productShare;
        const finalProductCost = productTotal + totalAllocatedOverhead - allocatedDiscount;
        const finalCostPerUnit = quantity > 0 ? finalProductCost / quantity : 0;

        // Use patchValue with emitEvent:false to avoid triggering valueChanges
        control.patchValue({
          percentageOfPurchase: Math.round(percentage * 100) / 100,
          allocatedTax: Math.round(allocatedTax * 100) / 100,
          allocatedPackingCharge: Math.round(allocatedPacking * 100) / 100,
          allocatedTransport: Math.round(allocatedTransport * 100) / 100,
          totalAllocatedOverhead: Math.round(totalAllocatedOverhead * 100) / 100,
          finalCostPerUnit: Math.round(finalCostPerUnit * 100) / 100
        }, { emitEvent: false });
      } else {
        // if totalPurchaseAmount is zero, ensure numeric fields are zeroed (without emitting)
        control.patchValue({
          percentageOfPurchase: 0,
          allocatedTax: 0,
          allocatedPackingCharge: 0,
          allocatedTransport: 0,
          totalAllocatedOverhead: 0,
          finalCostPerUnit: 0
        }, { emitEvent: false });
      }
    });

    // Update percentage fields only if discount percent is not being edited
    if (!this.purchaseForm.get('discountPercent')?.enabled) {
      this.updatePercentages();
    }
  }

  /**
   * Update tax and discount percentages
   */
  updatePercentages(): void {
    if (this.loading) return;
    if (this.totalPurchaseAmount > 0) {
      const taxAmount = this.purchaseForm.get('taxAmount')?.value || 0;
      const taxPercent = (taxAmount / this.totalPurchaseAmount) * 100;
      const taxPercentControl = this.purchaseForm.get('taxPercent');
      taxPercentControl?.setValue(Math.round(taxPercent * 100) / 100, { emitEvent: false });

      const discountAmount = this.purchaseForm.get('discountAmount')?.value || 0;
      const discountPercent = (discountAmount / (this.totalPurchaseAmount + taxAmount || 1)) * 100;
      const discountPercentControl = this.purchaseForm.get('discountPercent');
      discountPercentControl?.setValue(Math.round(discountPercent * 100) / 100, { emitEvent: false });
    } else {
      // zero-out percentages when no total
      this.purchaseForm.get('taxPercent')?.setValue(0, { emitEvent: false });
      this.purchaseForm.get('discountPercent')?.setValue(0, { emitEvent: false });
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
    if (this.mode === 'view') {
      return; // Do not save in view mode
    }
    // Mark all fields as touched for validation
    this.markAllFieldsAsTouched();
    
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
        purchaseAmount: formValue.purchaseAmount,
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
      this.purchaseService.createPurchaseWithProducts(seasonId, purchaseData).subscribe(
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
   * Mark all fields as touched for validation
   */
  private markAllFieldsAsTouched(): void {
    // Mark basic fields
    this.fieldTouched.add('partyName');
    this.fieldTouched.add('purchaseDate');
    
    // Mark item fields
    this.items.controls.forEach((control, index) => {
      this.fieldTouched.add(`item_${index}_productName`);
      this.fieldTouched.add(`item_${index}_quantity`);
      this.fieldTouched.add(`item_${index}_ratePerUnit`);
    });
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