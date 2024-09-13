import { FilterQuery } from "mongoose";

import { ITokenInterface } from "../interfaces/token.interface";
import { TokenModel } from "../models/TokenModel";

class TokenRepository {
  public async create(dto: ITokenInterface): Promise<ITokenInterface> {
    return await TokenModel.create(dto);
  }

  public async findByParams(
    params: FilterQuery<ITokenInterface>,
  ): Promise<ITokenInterface> {
    return await TokenModel.findOne(params);
  }

  public async deleteById(id: string): Promise<void> {
    await TokenModel.deleteOne({ _id: id });
  }
}

export const tokenRepository = new TokenRepository();
