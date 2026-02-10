export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    restaurantId: number;
    role: "ADMIN" | "CASHIER" | "KITCHEN" | "SUPER_ADMIN";
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

