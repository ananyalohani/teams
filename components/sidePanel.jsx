import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useRoomCallContext } from '@/context/roomCallContext';

function SidePanel({ visible, id, title, children }) {
  const { togglePanel } = useRoomCallContext();

  return (
    <div
      id={id}
      className={
        visible
          ? 'flex flex-col bg-gray-900 w-80 border-l border-gray-950'
          : 'hidden'
      }
      style={{ maxHeight: 'calc(100vh - 10rem)' }}
    >
      <div className='bg-gray-800 w-full p-4 border-b-2 border-gray-950'>
        <div className='flex flex-row text-gray-200 justify-between'>
          <p className='font-semibold'>{title}</p>
          <div className='cursor-pointer' onClick={() => togglePanel('')}>
            <IoCloseOutline className='text-gray-200 h-6 w-6' />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default SidePanel;
