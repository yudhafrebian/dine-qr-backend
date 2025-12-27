export interface CreateSubscriptionDTO {
  restaurantId: number;
  planId: number;
  status: "ACTIVE" | "EXPIRED" | "CANCELED";
  autoRenew: boolean;
  startDate: Date;
  endDate: Date | null;
}

export interface ISubscription extends CreateSubscriptionDTO {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
