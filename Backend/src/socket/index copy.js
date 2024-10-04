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

const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("New user connected", socket.id);

  const user = socket.handshake.auth.user;

  socket.join(user?._id?.toString());

  onlineUser.add(user?._id?.toString());
  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("navbar", async (userId) => {
    const notifications = await getNofitications(userId);

    io.to(userId).emit("notifications", notifications);
  });

  socket.on("seen notification", async (notificationId) => {
    const seenNotificacion = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { seen: true },
      { new: true }
    );
    const notifications = await getNofitications(seenNotificacion.receiver);

    io.to(seenNotificacion.receiver.toString()).emit(
      "notifications",
      notifications
    );
  });

  socket.on("chat page", async (receiverId) => {
    const receiverDetails = await UserModel.findById(receiverId).select(
      "-password"
    );
    const receiver = {
      _id: receiverDetails?._id,
      name: receiverDetails?.username,
      email: receiverDetails?.email,
      profile_pic: receiverDetails?.profilePicture?.url,
      online: onlineUser.has(receiverId),
    };

    socket.emit("user receiver", receiver);

    const getConversation = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: receiverId },
        { sender: receiverId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("messages", getConversation?.messages || []);
  });

  socket.on("seen messages", async (receiverId) => {
    let getConversation = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: receiverId },
        { sender: receiverId, receiver: user?._id },
      ],
    });
    const messageIds = getConversation?.messages || [];
    const updateMessages = await MessageModel.updateMany(
      { _id: { $in: messageIds }, msgByUserId: receiverId },
      { $set: { seen: true } }
    );

    const updateNotifications = await NotificationModel.updateMany(
      { sender: receiverId, receiver: user?._id, type: "message" },
      { $set: { seen: true } }
    );

    const conversationsSender = await getConversations(user?._id?.toString());
    const conversationsReceiver = await getConversations(receiverId);

    io.to(user?._id?.toString()).emit("conversations", conversationsSender);
    io.to(receiverId).emit("conversations", conversationsReceiver);

    const notificationsReceiver = await getNofitications(user?._id?.toString());
    const notificationsSender = await getNofitications(receiverId);

    io.to(user?._id?.toString()).emit("notifications", notificationsReceiver);
    io.to(receiverId).emit("notifications", notificationsSender);
  });

  socket.on("new message", async (newMessage) => {
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

    io.to(newMessage?.sender).emit("conversations", conversationsSender);
    io.to(newMessage?.receiver).emit("conversations", conversationsReceiver);
  });

  socket.on("new notification", async (newNotification) => {
    const createNotification = new NotificationModel({
      sender: newNotification.sender,
      receiver: newNotification.receiver,
      content: newNotification.content,
      type: newNotification.type,
    });
    const saveNotification = await createNotification.save();
    const notifications = await getNofitications(newNotification.receiver);

    io.to(newNotification.receiver).emit("notifications", notifications);
  });

  socket.on("chats page", async (userId) => {
    const conversations = await getConversations(userId);

    socket.emit("conversations", conversations);
  });

  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());

    console.log("User disconnected", socket.id);
  });
});

export { app, server };
