export interface IOrderItem {
  menuItemId: number;
  qty: number;
  price: number; // Snapshot harga saat dipesan
}

export interface IOrder {
  orderNumber: string;
  restaurantId: number;
  tableId: number;
  paymentMethod: "CASH" | "QRIS";
  paymentStatus: "PAID" | "UNPAID";
  orderStatus: "PENDING" | "PROCESSING" | "READY" | "COMPLETED";
  totalPrice: number;
  OrderItem: {
    create: IOrderItem[];
  };
}