import io from 'socket.io-client';
import { url } from '@/lib';
import { formattedTimeString } from '@/utils';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRoomContext } from './RoomContext';

const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
  const { roomId, user } = useRoomContext(); // get roomId and NextAuth user object from RoomContext
  const [usersList, setUsersList] = useState([]); // List of NextAuth `user` objects present in the room
  const [chats, setChats] = useState([]); // keep track of all the chats
  const socketRef = useRef(null); // ref to the socket connection object
  const socketConnected = useRef(false); // set the state of connection of socket

  useEffect(() => {
    if (!chats.length) return;
    saveChatSession();
  }, [chats]);

  useEffect(() => {
    // connect to the socket
    if (roomId && !socketConnected.current) {
      socketRef.current = io(url.server);
      socketConnected.current = true;
    }
  }, [roomId]);

  useEffect(() => {
    const cleanup = (event) => {
      // cleanup function for call disconnect
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

  async function saveChatSession() {
    try {
      const jsonChats = JSON.stringify(chats);
      const reqBody = {
        roomId: '6pYcXgVM',
        chats: jsonChats,
      };
      const result = await fetch('/api/chat-sessions', {
        method: 'PUT',
        body: JSON.stringify(reqBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('chat session saved:', result);
    } catch (e) {
      console.error(e);
    }
  }

  async function getChatSession() {
    try {
      const result = await fetch(`/api/chat-sessions?roomId=${'6pYcXgVM'}`);
      console.log('get result:', result);
    } catch (e) {
      console.error(e);
    }
  }

  function joinRoom() {
    // join the room
    getChatSession();
    socketRef.current.emit('join-room', { roomId, user });

    // alert if the room is full
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
    // send a text message within the video call
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
      msgData: chat,
    });
  }

  function receiveMessages() {
    // listen to incoming messages from sockets
    socketRef.current.on('receive-message', ({ msgData }) => {
      addChat(msgData);
    });
  }

  function addChat(message) {
    // add message to the list of chats
    setChats((chats) => [...chats, message]);
  }

  const contextProps = {
    chats,
    socketConnected,
    usersList,
    joinRoom,
    saveChatSession,
    getChatSession,
    sendMessage,
    receiveMessages,
    updateUsersList,
  };

  return (
    <SocketContext.Provider value={contextProps}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocketContext = () => useContext(SocketContext);

export { SocketContextProvider, useSocketContext };
