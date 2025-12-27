import { IRestaurant } from "./restaurant.interface";
import { ISubscription } from "./subscription.interface";
import { IUser } from "./user.interface";

export interface IAuth {
    user:IUser,
    restaurant:IRestaurant,
    subscription:ISubscription
}