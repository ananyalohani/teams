import React from 'react';

export default function ChatPanel() {
  return (
    <div className='flex flex-col bg-white w-80 absolute top-24 right-0 bottom-20 border-l-2'>
      <div className='bg-indigo-100 w-full p-5'>
        <div className='flex flex-row space-x-2'>
          <p className='font-semibold text-indigo-600'>Meeting ID:</p>
          <p>{'xyz123'}</p>
        </div>
        <div className='flex flex-row space-x-2'>
          <p className='font-semibold text-indigo-600'>Participants:</p>
          <p>{4}</p>
        </div>
      </div>
      <div id='chat-window' className='flex-1'></div>
      <div className='flex flex-row justify-evenly my-2'>
        <input
          type='text'
          className='border-2 bg-gray-100 rounded w-56 text-base px-3 py-2'
        />
        <button className='btn-light'>Send</button>
      </div>
    </div>
  );
}
