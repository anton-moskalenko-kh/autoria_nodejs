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
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  _userId: string | IUserInterface;
  message?: string;
}
