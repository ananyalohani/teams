import React, { useState } from 'react';
import { BiLink } from 'react-icons/bi';

function ChatPanel({ clientURL, roomId, peers, sendMessage, chats }) {
  const [message, setMessage] = useState(''); // bind this to the input text-box

  return (
    <div
      id='chat-panel'
      className='flex flex-col bg-gray-900 w-80 absolute top-24 right-0 bottom-20 border-l border-gray-600'
    >
      <div className='bg-blue-400 w-full p-4 flex flex-col space-y-2'>
        <div>
          <div className='flex flex-row text-gray-900 space-x-2'>
            <p className='font-bold whitespace-nowrap'>Meeting ID</p>
            <p>{roomId}</p>
          </div>
          <div className='flex flex-row text-gray-900 space-x-2'>
            <p className='font-bold whitespace-nowrap'>Participants</p>
            <p>{peers.length + 1}</p>
          </div>
        </div>
        <button
          className='btn-alt btn-small'
          onClick={() =>
            navigator.clipboard.writeText(`${clientURL}call/${roomId}`)
          }
        >
          <BiLink className='btn-icon' />
          Copy Link
        </button>
      </div>
      <div
        id='chat-window'
        className='flex-1 text-gray-200 py-3 px-4 overflow-y-scroll'
      >
        {chats.map((msgData, idx) => (
          <div key={idx}>
            <p>{msgData.userId}</p>
            <p>{msgData.message}</p>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          sendMessage(e, message);
          setMessage('');
        }}
        className='flex flex-row justify-evenly my-3'
      >
        <input
          type='text'
          className='bg-gray-800 border border-gray-600 text-gray-200 rounded-md p-2 w-56'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder='Type your message'
        />

        <button type='submit' className='btn btn-small'>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatPanel;
