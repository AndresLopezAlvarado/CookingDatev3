import User from "../models/UserModel.js";
import NotificationModel from "../models/NotificationModel.js";

const getNofitications = async (userId) => {
  if (userId) {
    const idsWhoBlockedYou = await User.find({
      blockedPeople: { $in: [userId] },
    }).select("_id");

    const idsWhoBlockedYouArray = idsWhoBlockedYou.map((user) =>
      user._id.toString()
    );

    const unseenNotifications = await NotificationModel.find({
      receiver: userId,
      seen: false,
      sender: { $nin: idsWhoBlockedYouArray },
    })
      .populate("sender")
      .sort({ createdAt: -1 });

    return unseenNotifications;
  }
};

export default getNofitications;
