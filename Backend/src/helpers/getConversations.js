import User from "../models/UserModel.js";
import { ConversationModel } from "../models/ConversationModel.js";

const getConversations = async (userId) => {
  if (userId) {
    const idsWhoBlockedYou = await User.find({
      blockedPeople: { $in: [userId] },
    }).select("_id");

    const userConversations = await ConversationModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
      $and: [
        { sender: { $nin: idsWhoBlockedYou } },
        { receiver: { $nin: idsWhoBlockedYou } },
      ],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");

    const conversations = userConversations.map((conv) => {
      const countUnseenMsg = conv?.messages?.reduce((prev, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();

        if (msgByUserId !== userId) return prev + (curr?.seen ? 0 : 1);
        else return prev;
      }, 0);

      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMsg: countUnseenMsg,
        lastMsg: conv?.messages[conv?.messages?.length - 1],
      };
    });

    return conversations;
  } else {
    return [];
  }
};

export default getConversations;
