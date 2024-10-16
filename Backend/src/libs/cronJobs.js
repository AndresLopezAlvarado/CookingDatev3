import cron from "node-cron";
import UserModel from "../models/UserModel.js";

cron.schedule("* * * * *", async () => {
  const expirationTime = new Date(Date.now() - 60 * 1000);

  try {
    await UserModel.updateMany(
      {
        $or: [
          { "cookAtHomePeople.reactedAt": { $lt: expirationTime } },
          { "eatOutsidePeople.reactedAt": { $lt: expirationTime } },
        ],
      },
      {
        $pull: {
          cookAtHomePeople: { reactedAt: { $lt: expirationTime } },
          eatOutsidePeople: { reactedAt: { $lt: expirationTime } },
        },
      }
    );

    console.log("Reactions successfully eliminated");
  } catch (error) {
    console.error({
      message: "Something went wrong on verify reactions overdue",
      error: error,
    });

    throw new Error({
      message: "Something went wrong on verify reactions overdue",
      error: error,
    });
  }
});
