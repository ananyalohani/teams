import React, { useState, useEffect } from 'react';
import { IoSendSharp } from 'react-icons/io5';

import { useRoomCallContext } from '@/context/roomCallContext';
import SidePanel from '@/components/sidePanel';

function ChatPanel() {
  const [message, setMessage] = useState(''); // bind this to the input text-box

  const { user, sendMessage, chats, displayPanel, togglePanel } =
    useRoomCallContext();

  return (
    <SidePanel id='chat-panel' visible={displayPanel === 'chat'} title={'Chat'}>
      <div
        id='chat-window'
        className='flex-1 text-gray-200 p-3 overflow-y-scroll flex flex-col space-y-2'
      >
        {chats.map((msgData, idx) => (
          <div
            key={idx}
            className='bg-gray-850 rounded py-2 px-3 border-l-2 flex flex-col space-y-1'
            style={{ borderLeftColor: msgData.userColor }}
          >
            <div className='flex flex-row items-center justify-between'>
              <p className='text-sm font-semibold'>
                {msgData.userId === user.id
                  ? `${msgData.name} (You)`
                  : `${msgData.name}`}
              </p>
              <p className='text-sm font-light opacity-80'>{msgData.time}</p>
            </div>
            <p className='text-sm'>{msgData.message}</p>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          sendMessage(e, message, user.id, user.name, user.color);
          setMessage('');
        }}
        className='flex flex-row justify-evenly my-3'
      >
        <input
          type='text'
          className='text-box'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder='Type your message...'
        />

        <button type='submit' className=''>
          <IoSendSharp className='text-gray-700 hover:text-blue-400 w-6 h-6' />
        </button>
      </form>
    </SidePanel>
  );
}

export default ChatPanel;
