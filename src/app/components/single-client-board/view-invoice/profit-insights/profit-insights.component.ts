// profit-insights.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface ProfitInsightsData {
  profitSummary: {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    profitPercentage: number;
  };
  profitRecords: any[];
  invoiceDetails: any[];
  invoiceId: number;
  clientName: string;
}

@Component({
  selector: 'app-profit-insights',
  templateUrl: './profit-insights.component.html',
  styleUrls: ['./profit-insights.component.css']
})
export class ProfitInsightsComponent implements OnInit {
  
  constructor(
    public dialogRef: MatDialogRef<ProfitInsightsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfitInsightsData
  ) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  // Helper method to get profit margin status
  getProfitMarginStatus(): string {
    const margin = this.data.profitSummary.profitPercentage;
    if (margin < 5) return 'low';
    if (margin < 15) return 'moderate';
    return 'good';
  }

  // Helper method to get profit margin color
  getProfitMarginColor(): string {
    const status = this.getProfitMarginStatus();
    switch (status) {
      case 'low': return '#f44336';
      case 'moderate': return '#ff9800';
      case 'good': return '#4caf50';
      default: return '#757575';
    }
  }

  // Helper method to format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  }

  // Get item-wise profit breakdown
  getItemProfitBreakdown() {
    return this.data.invoiceDetails.map(item => {
      const profitRecord = this.data.profitRecords.find(record => 
        record.productId === item.productId
      );
      
      return {
        ...item,
        profitRecord,
        profitPerUnit: item.profitAmount ? (item.profitAmount / item.quanity) : 0,
        marginPercent: item.profitPercentage || 0
      };
    });
  }
}