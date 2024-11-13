import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { FRONTEND_URL } from "../config/config.js";
import {
  ConversationModel,
  MessageModel,
} from "../models/ConversationModel.js";
import UserModel from "../models/UserModel.js";
import NotificationModel from "../models/NotificationModel.js";
import ReactionModel from "../models/ReactionModel.js";
import getConversations from "../helpers/getConversations.js";
import getNofitications from "../helpers/getNotifications.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: FRONTEND_URL, credentials: true },
});

const onlineUsers = new Set();
const usersInReactions = new Set();
const usersInChat = new Set();

io.on("connection", async (socket) => {
  console.log(`User connected to socket: ${socket.id}`);

  const userId = socket.handshake.auth.userId;
  const userIdToString = userId?.toString();
  const notificationsRoom = userIdToString + "notifications";
  const peopleRoom = userIdToString + "people";
  const personRoom = userIdToString + "person";
  const chatRoom = userIdToString + "chat";
  const chatsRoom = userIdToString + "chats";
  const reactionsRoom = userIdToString + "reactions";

  //Online users
  onlineUsers.add(userIdToString);
  io.emit("onlineUsers", Array.from(onlineUsers));

  //Notifications
  socket.join(notificationsRoom);

  socket.on("getNotifications", async () => {
    const unseenNotifications = await getNofitications(userId);

    io.to(notificationsRoom).emit("unseenNotifications", unseenNotifications);
  });

  socket.on("seenNotification", async (notificationId) => {
    const seenNotification = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { seen: true },
      { new: true }
    );

    await NotificationModel.updateMany(
      {
        sender: seenNotification.sender,
        receiver: seenNotification.receiver,
        type: seenNotification.type,
      },
      { seen: true }
    );

    const notifications = await getNofitications(seenNotification.receiver);

    io.to(seenNotification.receiver.toString() + "notifications").emit(
      "unseenNotifications",
      notifications
    );
  });

  socket.on("seenNotifications", async () => {
    await NotificationModel.updateMany(
      { receiver: userId, type: { $in: ["reaction"] } },
      { $set: { seen: true } }
    );

    const notifications = await getNofitications(userIdToString);

    io.to(notificationsRoom).emit("unseenNotifications", notifications);
  });

  socket.on("newNotification", async (newNotification) => {
    const createNotification = new NotificationModel({
      sender: newNotification.sender,
      receiver: newNotification.receiver,
      content: newNotification.content,
      type: newNotification.type,
    });

    await createNotification.save();

    const notifications = await getNofitications(newNotification.receiver);

    io.to(newNotification.receiver + "notifications").emit(
      "unseenNotifications",
      notifications
    );
  });

  //People
  socket.on("joinPeople", () => socket.join(peopleRoom));

  socket.on("updateLocation", async ({ userId, lat, lng }) => {
    try {
      await UserModel.findByIdAndUpdate(
        userId,
        { location: { lat, lng } },
        { new: true }
      );

      io.emit("locationUpdated");
    } catch (error) {
      console.error("Error actualizando la ubicación del usuario:", error);
    }
  });

  socket.on("leavePeople", () => socket.leave(peopleRoom));

  //Person
  socket.on("joinPerson", () => {
    socket.join(personRoom);
    io.emit("usersInReactions", Array.from(usersInReactions));
  });

  socket.on("getIsBlocker", async (receiverId) => {
    const person = await UserModel.findById(receiverId);
    const isBlocker = person?.blockedPeople?.includes(userId);

    io.to(personRoom).emit("isBlocker", isBlocker);
  });

  socket.on("getIsFavorite", async (receiverId) => {
    const user = await UserModel.findById(userId);
    const isFavorite = user?.favoritePeople?.includes(receiverId);

    io.to(personRoom).emit("isFavorite", isFavorite);
  });

  socket.on("getIsBlocked", async (receiverId) => {
    const user = await UserModel.findById(userId);
    const isBlocked = user?.blockedPeople?.includes(receiverId);

    io.to(personRoom).emit("isBlocked", isBlocked);
    io.to(chatRoom).emit("isBlocked", isBlocked);
  });

  socket.on("getReacted", async (receiverId) => {
    const user = await UserModel.findById(userId);
    const isCookAtHome = user?.cookAtHomePeople?.some(
      (reaction) => reaction.userId?.toString() === receiverId
    );
    const isEatOutside = user?.eatOutsidePeople?.some(
      (reaction) => reaction.userId?.toString() === receiverId
    );

    io.to(personRoom).emit("isReacted", { isCookAtHome, isEatOutside });
  });

  socket.on("cookAtHome", async (receiverId) => {
    try {
      const user = await UserModel.findById(userId);
      const alreadyReacted = user?.cookAtHomePeople?.some(
        (reaction) => reaction.userId?.toString() === receiverId
      );

      if (!alreadyReacted) {
        user.cookAtHomePeople.push({
          userId: receiverId,
          reactedAt: new Date(),
        });

        await user.save();
      }
    } catch (error) {
      console.error({
        message: "Something went wrong on cookAtHome",
        error: error,
      });

      throw new Error({
        message: "Something went wrong on cookAtHome",
        error: error,
      });
    }
  });

  socket.on("eatOutside", async (receiverId) => {
    try {
      const user = await UserModel.findById(userId);
      const alreadyReacted = user?.eatOutsidePeople?.some(
        (reaction) => reaction.userId.toString() === receiverId
      );

      if (!alreadyReacted) {
        user.eatOutsidePeople.push({
          userId: receiverId,
          reactedAt: new Date(),
        });

        await user.save();
      }
    } catch (error) {
      console.error({
        message: "Something went wrong on eatOutside",
        error: error,
      });

      throw new Error({
        message: "Something went wrong on eatOutside",
        error: error,
      });
    }
  });

  socket.on("markAsFavorite", async (favoritePersonId) => {
    try {
      const user = await UserModel.findById(userId);

      if (!user?.favoritePeople?.includes(favoritePersonId)) {
        user.favoritePeople.push(favoritePersonId);

        await user.save();
      }
    } catch (error) {
      console.error({
        message: "Something went wrong on markAsFavorite",
        error: error,
      });

      throw new Error({
        message: "Something went wrong on markAsFavorite",
        error: error,
      });
    }
  });

  socket.on("unmarkAsFavorite", async (unfavoritePersonId) => {
    try {
      const user = await UserModel.findById(userId);

      user.favoritePeople = user.favoritePeople.filter(
        (favoritePersonId) => favoritePersonId.toString() !== unfavoritePersonId
      );

      await user.save();
    } catch (error) {
      console.error({
        message: "Something went wrong on unmarkAsFavorite",
        error: error,
      });

      throw new Error({
        message: "Something went wrong on unmarkAsFavorite",
        error: error,
      });
    }
  });

  socket.on("blockPerson", async (blockPersonId) => {
    try {
      const user = await UserModel.findById(userId);

      if (!user?.blockedPeople?.includes(blockPersonId)) {
        user.blockedPeople.push(blockPersonId);

        await user.save();

        io.to(blockPersonId + "notifications").emit("personBlocked");
        io.to(blockPersonId + "people").emit("personBlocked");
        io.to(blockPersonId + "chats").emit("personBlocked");
        io.to(chatRoom).emit("isBlocked", true);
      }
    } catch (error) {
      console.error({
        message: "Something went wrong on block person (blockPerson)",
        error: error,
      });

      throw new Error({
        message: "Something went wrong on block person (blockPerson)",
        error: error,
      });
    }
  });

  socket.on("unblockPerson", async (unblockPersonId) => {
    try {
      const user = await UserModel.findById(userId);

      user.blockedPeople = user.blockedPeople.filter(
        (blockedId) => blockedId.toString() !== unblockPersonId
      );

      await user.save();

      io.to(unblockPersonId + "notifications").emit("personBlocked");
      io.to(unblockPersonId + "people").emit("personBlocked");
      io.to(unblockPersonId + "chats").emit("personBlocked");
      io.to(chatRoom).emit("isBlocked", false);
    } catch (error) {
      console.error({
        message: "Something went wrong on unblockPerson",
        error: error,
      });

      throw new Error({
        message: "Something went wrong on unblockPerson",
        error: error,
      });
    }
  });

  socket.on("leavePerson", () => {
    io.emit("usersInReactions", Array.from(usersInReactions));
    socket.leave(personRoom);
  });

  //Chat
  socket.on("joinChat", () => {
    socket.join(chatRoom);
    usersInChat.add(userIdToString);
    io.emit("usersInChat", Array.from(usersInChat));
  });

  socket.on("getConversation", async (receiverId) => {
    const receiverDetails = await UserModel.findById(receiverId).select(
      "-password"
    );
    const receiverUser = {
      _id: receiverDetails?._id,
      name: receiverDetails?.username,
      email: receiverDetails?.email,
      profile_pic: receiverDetails?.profilePicture?.url,
      online: onlineUsers.has(receiverId),
    };

    socket.emit("receiverUser", receiverUser);

    const getConversation = await ConversationModel.findOne({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("messages", getConversation?.messages || []);
  });

  socket.on("seenMessages", async (receiverId) => {
    let getConversation = await ConversationModel.findOne({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    });
    const messageIds = getConversation?.messages || [];
    const updateMessages = await MessageModel.updateMany(
      { _id: { $in: messageIds }, msgByUserId: receiverId },
      { $set: { seen: true } }
    );

    const updateNotifications = await NotificationModel.updateMany(
      { sender: receiverId, receiver: userId, type: "message" },
      { $set: { seen: true } }
    );

    const conversationsSender = await getConversations(userIdToString);
    const conversationsReceiver = await getConversations(receiverId);

    io.to(chatsRoom).emit("conversations", conversationsSender);
    io.to(receiverId + "chats").emit("conversations", conversationsReceiver);

    const notificationsReceiver = await getNofitications(userIdToString);
    const notificationsSender = await getNofitications(receiverId);

    io.to(notificationsRoom).emit("unseenNotifications", notificationsReceiver);
    io.to(receiverId + "notifications").emit(
      "unseenNotifications",
      notificationsSender
    );
  });

  socket.on("newMessage", async (newMessage) => {
    let getConversation = await ConversationModel.findOne({
      $or: [
        { sender: newMessage?.sender, receiver: newMessage?.receiver },
        { sender: newMessage?.receiver, receiver: newMessage?.sender },
      ],
    });

    if (!getConversation) {
      const createConversation = await ConversationModel({
        sender: newMessage?.sender,
        receiver: newMessage?.receiver,
      });

      getConversation = await createConversation.save();
    }

    const message = new MessageModel({
      text: newMessage?.text,
      imageUrl: newMessage?.imageUrl,
      videoUrl: newMessage?.videoUrl,
      msgByUserId: newMessage?.msgByUserId,
    });
    const saveMessage = await message.save();
    const updateConversation = await ConversationModel.updateOne(
      { _id: getConversation?._id },
      {
        $push: { messages: saveMessage?._id },
      }
    );
    const conversation = await ConversationModel.findOne({
      $or: [
        { sender: newMessage?.sender, receiver: newMessage?.receiver },
        { sender: newMessage?.receiver, receiver: newMessage?.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(chatRoom).emit("messages", conversation?.messages || []);
    io.to(newMessage?.receiver + "chat").emit(
      "messages",
      conversation?.messages || []
    );

    const conversationsSender = await getConversations(newMessage?.sender);
    const conversationsReceiver = await getConversations(newMessage?.receiver);

    io.to(chatsRoom).emit("conversations", conversationsSender);
    io.to(newMessage?.receiver + "chats").emit(
      "conversations",
      conversationsReceiver
    );
  });

  socket.on("leaveChat", () => {
    usersInChat.delete(userIdToString);
    io.emit("usersInChat", Array.from(usersInChat));
    socket.leave(chatRoom);
  });

  //Chats
  socket.on("joinChats", () => socket.join(chatsRoom));

  socket.on("getConversations", async () => {
    const conversations = await getConversations(userId);

    io.to(chatsRoom).emit("conversations", conversations);
  });

  socket.on("leaveChats", () => socket.leave(chatsRoom));

  //Reactions
  socket.on("joinReactions", () => {
    socket.join(reactionsRoom);
    usersInReactions.add(userIdToString);
  });

  socket.on("getReactions", async () => {
    try {
      const reactions = await ReactionModel.find({ receiver: userId })
        .populate("sender")
        .sort({ createdAt: -1 });

      io.to(reactionsRoom).emit("reactions", reactions);
    } catch (error) {
      console.error({
        message: "Something went wrong on get reactions",
        error: error,
      });
    }
  });

  socket.on("newReaction", async ({ receiverId, content, type }) => {
    try {
      const createReaction = new ReactionModel({
        sender: userId,
        receiver: receiverId,
        content: content,
        type: type,
      });

      await createReaction.save();

      const receiverReactions = await ReactionModel.find({
        receiver: receiverId,
      })
        .populate("sender")
        .sort({ createdAt: -1 });

      io.to(receiverId + "reactions").emit("reactions", receiverReactions);
    } catch (error) {
      console.error({
        message: "Something went wrong on new reactions",
        error: error,
      });

      res.status(500).json({
        message: "Something went wrong on new reactions",
        error: error,
      });
    }
  });

  socket.on("leaveReactions", () => {
    usersInReactions.delete(userIdToString);
    socket.leave(reactionsRoom);
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(userIdToString);
    io.emit("onlineUsers", Array.from(onlineUsers));

    console.log("User disconnected", socket.id);
  });
});

export { app, server };
