import { IProductItem } from "./product";
import { IUserItem } from "./user";

export interface ICartItem {
    clock: string
    colors: string
    product: IProductItem
    owner: IUserItem
}