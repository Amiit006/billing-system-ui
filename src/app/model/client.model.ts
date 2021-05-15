import { Address } from "./address.model";

export interface Client {
    clientId: string;
    clientName: string;
    mobile: number;
    email: string;
    gstNumber: string;
    address: Address;
}





