import { Payment } from "./payment.model";

export interface InvoiceOverview {
    clientId;
    createdDate;
    grandTotalAmount;
    invoiceDate;
    invoiceId;
    modifiedDate;
    subTotalAmount;
    taxAmount;
    taxPercentage;
    payment: Payment;
}