const io = require('socket.io')();

const verifyPoodadakTokenSocket = require('../middlewares/verifyPoodadakTokenSocket');
const registerConnection = require('./socketEventHandlers/registerConnection');
const registerDisconnect = require('./socketEventHandlers/registerDisconnect');
const registerLoadChatList = require('./socketEventHandlers/registerLoadChatList');
const registerSendChat = require('./socketEventHandlers/registerSendChat');

const socketAPI = {
  io: io,
};

const toiletChatList = io.of(/^\/toiletId-/);

toiletChatList.use(verifyPoodadakTokenSocket);

toiletChatList.on('connection', async (socket) => {
  const chatroomId = await registerConnection(socket);
  registerLoadChatList(socket);
  registerSendChat(socket, chatroomId);
  registerDisconnect(socket, chatroomId);
});

module.exports = socketAPI;
