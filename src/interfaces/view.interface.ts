import { IAdsInterface } from "./ads.interface";

export interface IViewInterface {
  _id?: string;
  _adId: string | IAdsInterface;
  createdAt: Date;
}
