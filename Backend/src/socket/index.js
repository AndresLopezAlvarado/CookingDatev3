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
import getConversations from "../helpers/getConversations.js";
import getNofitications from "../helpers/getNotifications.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: FRONTEND_URL, credentials: true },
});

const onlineUsers = new Set();
const usersInChat = new Set();

io.on("connection", async (socket) => {
  console.log(`User connected to socket: ${socket.id}`);

  const userId = socket.handshake.auth.user?._id;
  const userIdToString = userId?.toString();
  const notificationsRoom = userIdToString + "navbar";

  onlineUsers.add(userIdToString);
  io.emit("onlineUsers", Array.from(onlineUsers));

  socket.on("joinNotifications", () => socket.join(notificationsRoom));

  socket.on("getNotifications", async () => {
    const unseenNotifications = await getNofitications(userId);

    io.to(userIdToString + "navbar").emit(
      "unseenNotifications",
      unseenNotifications
    );
  });

  socket.on("seenNotification", async (notificationId) => {
    const seenNotificacion = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { seen: true },
      { new: true }
    );
    const notifications = await getNofitications(seenNotificacion.receiver);
    io.to(seenNotificacion.receiver.toString() + "navbar").emit(
      "unseenNotifications",
      notifications
    );
  });

  socket.on("joinChat", () => {
    usersInChat.add(userIdToString);
    socket.join(userIdToString);
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

    io.to(userIdToString + "navbar").emit("conversations", conversationsSender);
    io.to(receiverId + "navbar").emit("conversations", conversationsReceiver);

    const notificationsReceiver = await getNofitications(userIdToString);
    const notificationsSender = await getNofitications(receiverId);

    io.to(userIdToString + "navbar").emit(
      "unseenNotifications",
      notificationsReceiver
    );
    io.to(receiverId + "navbar").emit(
      "unseenNotifications",
      notificationsSender
    );
  });

  socket.on("leaveChat", () => {
    usersInChat.delete(userIdToString);
    socket.leave(userIdToString);
    io.emit("usersInChat", Array.from(usersInChat));
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

    io.to(newMessage?.sender).emit("messages", conversation?.messages || []);
    io.to(newMessage?.receiver).emit("messages", conversation?.messages || []);

    const conversationsSender = await getConversations(newMessage?.sender);
    const conversationsReceiver = await getConversations(newMessage?.receiver);

    io.to(newMessage?.sender?.toString() + "navbar").emit(
      "conversations",
      conversationsSender
    );
    io.to(newMessage?.receiver).emit("conversations", conversationsReceiver);
  });

  socket.on("newNotification", async (newNotification) => {
    const createNotification = new NotificationModel({
      sender: newNotification.sender,
      receiver: newNotification.receiver,
      content: newNotification.content,
      type: newNotification.type,
    });
    const saveNotification = await createNotification.save();
    const notifications = await getNofitications(newNotification.receiver);

    io.to(newNotification.receiver + "navbar").emit(
      "unseenNotifications",
      notifications
    );
  });

  socket.on("getConversations", async () => {
    const conversations = await getConversations(userId);

    io.to(userIdToString + "navbar").emit("conversations", conversations);
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(userIdToString);

    console.log("User disconnected", socket.id);
  });
});

export { app, server };
