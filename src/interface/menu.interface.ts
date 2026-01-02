export interface IMenu {
    name: string;
    categoryId: number;
    restaurantId: number;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
}