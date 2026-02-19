export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    isOwner: boolean;
    restaurantId: number;
    role: "ADMIN" | "CASHIER" | "KITCHEN" | "SUPER_ADMIN" | "OWNER";
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

