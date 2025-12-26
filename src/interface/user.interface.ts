export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "CASHIER";
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}