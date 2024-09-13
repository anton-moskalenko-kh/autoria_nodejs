import moment from "moment";
import mongoose from "mongoose";

import { ViewModel } from "../models/ViewModel";

class ViewRepository {
  public async create(adId: string): Promise<void> {
    await ViewModel.create({ adId: adId });
  }

  public async getTotalViews(adId: string): Promise<number> {
    return await ViewModel.countDocuments({ adId: adId });
  }

  public async getTodayViews(adId: string): Promise<number> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const result = await ViewModel.aggregate([
      {
        $match: {
          adId: new mongoose.Types.ObjectId(adId),
          timestamp: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $count: "totalViews",
      },
    ]);
    return result.length > 0 ? result[0].totalViews : 0;
  }

  public async getWeekViews(adId: string): Promise<number> {
    const oneWeekAgo = moment().subtract(1, "weeks").startOf("day").toDate();
    const now = moment().endOf("day").toDate();

    const result = await ViewModel.aggregate([
      {
        $match: {
          adId: new mongoose.Types.ObjectId(adId),
          timestamp: { $gte: oneWeekAgo, $lte: now },
        },
      },
      {
        $count: "totalViews",
      },
    ]);
    return result.length > 0 ? result[0].totalViews : 0;
  }

  public async getMonthViews(adId: string): Promise<number> {
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const result = await ViewModel.aggregate([
      {
        $match: {
          adId: new mongoose.Types.ObjectId(adId),
          timestamp: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $count: "totalViews",
      },
    ]);
    return result.length > 0 ? result[0].totalViews : 0;
  }
}

export const viewRepository = new ViewRepository();
