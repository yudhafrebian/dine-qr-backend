export interface IRestaurant {
    id: number;
    ownerId: number;
    name: string;
    slug: string;
    logoUrl?: string | null;
    isActive: boolean;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}