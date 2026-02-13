export interface BalanceHistoryDTO {
  restaurantId: number;
  amount: number;
  type: "INCREMENT" | "DECREMENT";
  description?: string;
}

export interface IBalanceHistory extends BalanceHistoryDTO {
  id: number;
  createdAt: Date;
}
