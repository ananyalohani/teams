import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';

import { useRoomContext } from '@/context/RoomContext';

function SidePanel({ name, id, title, children }) {
  const { displayPanel, togglePanel, isChatSession } = useRoomContext();

  return (
    <div
      className={
        displayPanel === name
          ? 'flex flex-col bg-gray-900 w-80 border-l border-gray-950 text-gray-200'
          : 'hidden'
      }
      style={{
        height: 'calc(100vh - 10rem)',
      }}
    >
      <div className='bg-gray-800 w-full p-4 border-b-2 border-gray-950'>
        <div className='flex flex-row  justify-between'>
          <p className='font-semibold'>{title}</p>
          <div
            // className={`cursor-pointer ${isChatSession ? 'invisible' : ''}`}
            className='cursor-pointer'
            onClick={() => togglePanel('')}
          >
            <IoCloseOutline
              className={isChatSession ? 'h-6 w-6 ' : 'h-6 w-6'}
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default SidePanel;