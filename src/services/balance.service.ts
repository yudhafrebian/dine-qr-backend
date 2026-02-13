import { BalanceHistoryDTO } from "../interface/balance.interface";
import { BalanceRepository } from "../repositories/balance.repository";
import { RestaurantRepository } from "../repositories/restaurant.repository";
import { ApiError } from "../utils/ApiError";

export const BalanceService = {
    createBalanceHistory: async (data: BalanceHistoryDTO) => {
        return await BalanceRepository.create(data);
    },

    updateBalance: async (
    restaurantId: number,
    amount: number,
    type: "INCREMENT" | "DECREMENT",
  ) => {

    const balance = await RestaurantRepository.findById(restaurantId);

    if (!balance) throw new ApiError(404, "Restaurant not found");
    let newBalance = balance.balance;

    if (type === "INCREMENT"){
      newBalance += amount;
    } else {
      newBalance -= amount;
    }

    await RestaurantRepository.update(restaurantId, {
      ...balance,
      balance: newBalance,
    });
    return { ...balance, balance: newBalance };
  }
}