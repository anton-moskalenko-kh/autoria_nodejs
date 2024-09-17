import { FilterQuery } from "mongoose";

import { IActionTokenInterface } from "../interfaces/action-token.interface";
import { ITokenInterface } from "../interfaces/token.interface";
import { ActionToken } from "../models/ActionTokenModel";

class ActionTokenRepository {
  public async create(
    dto: IActionTokenInterface,
  ): Promise<IActionTokenInterface> {
    return await ActionToken.create(dto);
  }

  public async getByActionToken(
    actionToken: string,
  ): Promise<IActionTokenInterface> {
    return await ActionToken.findOne({ actionToken });
  }

  public async deleteByParams(
    params: FilterQuery<ITokenInterface>,
  ): Promise<void> {
    await ActionToken.deleteMany(params);
  }
}

export const actionTokenRepository = new ActionTokenRepository();
