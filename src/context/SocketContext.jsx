import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import io from 'socket.io-client';

import { url } from '@/lib';
import { formattedTimeString } from '@/utils';
import { useRoomContext } from './RoomContext';

const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
  const { roomId, user } = useRoomContext(); // get roomId and NextAuth user object from RoomContext
  const [usersList, setUsersList] = useState([]); // List of NextAuth `user` objects present in the room
  const [chats, setChats] = useState([]); // keep track of all the chats
  const [usersRaisedHand, setUsersRaisedHand] = useState([]);
  const socketRef = useRef(null); // ref to the socket connection object
  const socketConnected = useRef(false); // set the state of connection of socket

  useEffect(() => {
    // * connect to the socket and listen to incoming socket events
    if (roomId && !socketConnected.current) {
      socketRef.current = io(url.server);
      socketConnected.current = true;
      joinRoom();
      receiveMessages();
      updateUsersList();
      getChatHistory();
      listenToRaisedHands();
    }
  }, [roomId]);

  useEffect(() => {
    console.log(usersRaisedHand);
  }, [usersRaisedHand]);

  useEffect(() => {
    const cleanup = (event) => {
      // * cleanup function for call disconnect
      if (event.persisted) {
        return;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };

    if (socketRef.current) {
      window.addEventListener('beforeunload', cleanup);
      return () => {
        window.removeEventListener('beforeunload', cleanup);
      };
    }
  }, [roomId, socketRef.current]);

  function getChatHistory() {
    // * receive the chat history from the server
    socketRef.current.on('chat-history', ({ chatHistory }) => {
      setChats(chatHistory);
    });
    socketRef.current.on('user-cleared-chat-history', () => {
      setChats([]);
    });
  }

  function joinRoom() {
    // * join the room
    socketRef.current.emit('join-room', { roomId, user });

    // * alert if the room is full
    // * move hardcoded strings to config file
    socketRef.current.on('room-full', () => {
      alert('This room is full, please join a different room.');
    });

    socketRef.current.on('user-already-joined', () => {
      alert(
        "It looks like you're already in this room. You cannot join the same room twice."
      );
    });
  }

  function updateUsersList() {
    socketRef.current.on('updated-users-list', ({ usersInThisRoom }) => {
      setUsersList(usersInThisRoom);
    });
  }

  function sendMessage(e, body, user) {
    // * send a text message within the video call
    e.preventDefault();
    if (body === '') return;
    const chat = {
      user,
      message: {
        body,
        time: formattedTimeString(),
      },
    };
    addChat(chat);

    socketRef.current.emit('send-message', {
      roomId,
      chat,
    });
  }

  function receiveMessages() {
    // * listen to incoming messages from sockets
    socketRef.current.on('receive-message', ({ chat }) => {
      addChat(chat);
    });
  }

  function addChat(message) {
    // * add message to the list of chats
    setChats((chats) => [...chats, message]);
  }

  function clearChatHistory() {
    // * permanently delete chat history
    socketRef.current.emit('clear-chat-history', { roomId });
    setChats([]);
  }

  function findUser(userId) {
    return usersList.find((u) => u.id === userId);
  }

  function listenToRaisedHands() {
    socketRef.current.on('user-raised-hand', ({ userId }) => {
      setUsersRaisedHand((old) => [...old, userId]);
    });

    socketRef.current.on('user-unraised-hand', ({ userId }) => {
      console.log('user-unraised-hand');
      setUsersRaisedHand((old) => old.filter((id) => id !== userId));
    });
  }

  function toggleRaiseHand() {
    if (!usersRaisedHand.includes(user.id)) {
      socketRef.current.emit('raise-hand', { userId: user.id, roomId });
      setUsersRaisedHand((old) => [...old, user.id]);
    } else {
      socketRef.current.emit('unraise-hand', { userId: user.id, roomId });
      setUsersRaisedHand((old) => old.filter((id) => id !== user.id));
    }
  }

  const contextProps = {
    chats,
    socketConnected,
    usersList,
    joinRoom,
    sendMessage,
    receiveMessages,
    updateUsersList,
    clearChatHistory,
    findUser,
    usersRaisedHand,
    toggleRaiseHand,
  };

  return (
    <SocketContext.Provider value={contextProps}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocketContext = () => useContext(SocketContext);

export { SocketContextProvider, useSocketContext };
