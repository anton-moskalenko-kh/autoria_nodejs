import { IAdsInterface } from "./ads.interface";

export interface IViewInterface {
  _id?: string;
  adsId: string | IAdsInterface;
  createdAt: Date;
}
