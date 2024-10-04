import NotificationModel from "../models/NotificationModel.js";

const getNofitications = async (userId) => {
  if (userId) {
    const userNotifications = await NotificationModel.find({
      receiver: userId,
      seen: false,
    }).sort({ createdAt: -1 });

    return userNotifications;
  }
};

export default getNofitications;
