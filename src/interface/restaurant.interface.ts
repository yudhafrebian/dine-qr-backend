export interface IRestaurant {
    id: number;
    name: string;
    slug: string;
    isActive: boolean;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}