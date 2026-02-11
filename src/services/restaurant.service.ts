import { RestaurantRepository } from "../repositories/restaurant.repository";

export const RestaurantServices = {
  getAllRestaurants: async () => {
    return await RestaurantRepository.findAll();
  },
  getRestaurantById: async (id: number) => {
    const restaurant = await RestaurantRepository.findById(id);
    if (!restaurant) throw new Error("Restaurant not found");
    return restaurant;
  },
  update: async (id: number, data: any) => {
    const restaurant = await RestaurantRepository.findById(id);
    if (!restaurant) throw new Error("Restaurant not found");
    return await RestaurantRepository.update(id, data);
  },
  statusUpdate: async (id: number, isActive: boolean) => {
    const restaurant = await RestaurantRepository.findById(id);
    if (!restaurant) throw new Error("Restaurant not found");
    return await RestaurantRepository.statusUpdate(id, isActive);
  },
  delete: async (id: number) => {
    const restaurant = await RestaurantRepository.findById(id);
    if (!restaurant) throw new Error("Restaurant not found");
    return await RestaurantRepository.delete(id);
  },
};
