import { Payment } from "./payment.model";
import { Transport } from "./transport.model"

export interface Purchase {
    partyName: string;
    purchaseDate: string;
    purchaseAmount: number;
    taxPercent: number;
    taxAmount: number;
    discountPercent: number;
    discountAmount: number;
    extraDiscountAmount: number;
    transport: Transport;
    payments: Payment;
}