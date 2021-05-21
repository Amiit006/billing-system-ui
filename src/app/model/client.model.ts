import { Address } from "./address.model";

export interface Client {
    clientId: number;
    clientName: string;
    mobile: string;
    email?: string;
    gstNumber?: string;
    isActive?: boolean;
    address: Address;
}





