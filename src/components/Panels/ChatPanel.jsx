import React, { useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';

import { useSocketContext } from '@/context/SocketContext';
import SidePanel from './SidePanel';
import Scroller from '@/components/Scroller/Scroller';

function ChatPanel() {
  const [message, setMessage] = useState(''); // bind this to the input text-box

  const { sendMessage, chats, user } = useSocketContext();

  return (
    <SidePanel name='chat' title='Chat'>
      <div
        id='chat-window'
        className='flex-1 text-gray-200 p-3 overflow-y-scroll flex flex-col space-y-2'
      >
        {chats.map((chat, idx) => (
          <div
            key={idx}
            className='bg-gray-850 rounded py-2 px-3 border-l-2 flex flex-col space-y-1'
            style={{ borderLeftColor: chat.user.color }}
          >
            <div className='flex flex-row items-center justify-between'>
              <p className='text-sm font-semibold'>
                {chat.user.id === user.id
                  ? `${chat.user.name} (You)`
                  : `${chat.user.name}`}
              </p>
              <p className='text-sm font-light opacity-80'>
                {chat.message.time}
              </p>
            </div>
            <p className='text-sm'>{chat.message.body}</p>
          </div>
        ))}
        <Scroller />
      </div>
      <form
        onSubmit={(e) => {
          sendMessage(e, message, user);
          setMessage('');
        }}
        className='flex flex-row justify-evenly my-3 mx-3'
      >
        <input
          type='text'
          className='text-box'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder='Type your message...'
        />

        <button type='submit' className='mx-2'>
          <IoSendSharp className='text-gray-700 hover:text-blue-400 w-6 h-6' />
        </button>
      </form>
    </SidePanel>
  );
}

export default ChatPanel;
