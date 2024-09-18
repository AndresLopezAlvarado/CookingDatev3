export const handleSocket = async (socket) => {
    if (socket.recovered) {
      console.log({
        "Estoy en if socket.recovered": {
          socket_id: socket.id,
          socket_rooms: socket.rooms,
          socket_data: socket.data,
        },
  
        "socket.recovered": socket.recovered,
      });
    } else {
      console.log("New Socket.io session");
    }
  
    socket.on("setup", (user) => {
      console.log({
        "Estoy en on: setup": {
          socket_id: socket.id,
          socket_rooms: socket.rooms,
          socket_data: socket.data,
        },
  
        user: user,
  
        join: {
          user_id: user._id,
        },
  
        emit: "connected",
      });
  
      socket.join(user._id);
      socket.emit("connected");
    });
  
    socket.off("setup", (user) => {
      console.log({
        "Estoy en off: setup": {
          socket_id: socket.id,
          socket_rooms: socket.rooms,
          socket_data: socket.data,
        },
  
        user: user,
  
        leave: {
          user_id: user._id,
        },
      });
  
      socket.leave(user._id);
    });
  
    socket.on("join chat", (chatId) => {
      console.log({
        "Estoy en on: join chat": {
          socket_id: socket.id,
          socket_rooms: socket.rooms,
          socket_data: socket.data,
        },
  
        chatId: chatId,
  
        join: {
          chatId: chatId,
        },
      });
  
      socket.join(chatId);
    });
  
    // socket.on("typing", (room) => {
    //   socket.in(room).emit("typing");
    // });
  
    // socket.on("stop typing", (room) => {
    //   socket.in(room).emit("stop typing");
    // });
  
    socket.on("new message", (newMessageReceived) => {
      var chat = newMessageReceived.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageReceived.sender._id) return;
  
        socket.in(user._id).emit("receive message", newMessageReceived);
  
        console.log({
          "Estoy en on: new message": {
            socket_id: socket.id,
            socket_rooms: socket.rooms,
            socket_data: socket.data,
          },
  
          newMessageReceived: newMessageReceived,
  
          chat: newMessageReceived.chat,
  
          chatUsers: chat.users,
  
          user_id: user._id,
  
          newMessageReceivedSender_id: newMessageReceived.sender._id,
  
          emit: "receive message",
        });
      });
    });
  
    // socket.on("disconnect", () => {
    //   console.log({
    //     "Estoy en on: disconnect": {
    //       socket_id: socket.id,
    //       socket_rooms: socket.rooms,
    //       socket_data: socket.data,
    //     },
    //   });
    // });
  };
  