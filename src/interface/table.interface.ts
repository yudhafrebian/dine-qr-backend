export interface ITable {
  restaurantId: number;
  tableNumber: number;
}

export interface ITableEntity {
  id: number;
  restaurantId: number;
  tableNumber: number;
  qrCodeUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

