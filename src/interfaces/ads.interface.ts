import { AdsListOrderByEnum } from "../enums/ads-list-order-by.enum";
import { OrderEnum } from "../enums/order.enum";
import { IUserInterface } from "./user.interface";

export interface IAdsInterface {
  _id?: string;
  brand: string;
  model: string;
  year: number;
  images?: string[];
  price: number;
  description: string;
  city: string;
  currency: string;
  priceInUSD: number;
  priceInEUR: number;
  priceInUAH: number;
  exchangeRateUSD: number;
  exchangeRateEUR: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  _userId: string | IUserInterface;
  message?: string;
}

export interface IAdResponse
  extends Pick<
    IAdsInterface,
    | "_id"
    | "brand"
    | "model"
    | "year"
    | "images"
    | "description"
    | "price"
    | "currency"
    | "priceInUSD"
    | "priceInEUR"
    | "priceInUAH"
    | "exchangeRateUSD"
    | "exchangeRateEUR"
    | "city"
    | "isActive"
    | "message"
    | "_userId"
    | "createdAt"
    | "updatedAt"
  > {}

export interface IAdsListQuery {
  limit?: number;
  page?: number;
  search?: string;
  order?: OrderEnum;
  orderBy?: AdsListOrderByEnum;
}

export interface IAdsResponseList {
  data: IAdResponse[];
  total: number;
}
