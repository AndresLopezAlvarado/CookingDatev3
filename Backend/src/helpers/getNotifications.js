import NotificationModel from "../models/NotificationModel.js";

const getNofitications = async (userId) => {
  if (userId) {
    const unseenNotifications = await NotificationModel.find({
      receiver: userId,
      seen: false,
    }).sort({ createdAt: -1 });

    return unseenNotifications;
  }
};

export default getNofitications;
