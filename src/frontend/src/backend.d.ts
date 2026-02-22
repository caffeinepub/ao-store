import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface OrderData {
    id: bigint;
    status: OrderStatus;
    total: number;
    customer: Principal;
    products: Array<OrderedProduct>;
}
export interface OrderedProduct {
    quantity: bigint;
    product: Product;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    image: ExternalBlob;
    price: number;
}
export enum OrderStatus {
    shipped = "shipped",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(name: string, description: string, price: number, image: ExternalBlob): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllOrders(): Promise<Array<OrderData>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerOrders(): Promise<Array<OrderData>>;
    getProduct(id: bigint): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(orderedProducts: Array<OrderedProduct>): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
}
