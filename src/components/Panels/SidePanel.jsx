import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import classNames from 'classnames';

import { useRoomContext } from '@/context/RoomContext';

function SidePanel({ name, id, title, children }) {
  const { displayPanel, togglePanel } = useRoomContext();

  return (
    <div
      className={classNames({
        'flex flex-col bg-gray-900 w-screen md:w-80 border-l border-gray-950 text-gray-200 h-full':
          displayPanel === name,
        hidden: !Boolean(displayPanel) || displayPanel !== name,
      })}
    >
      <div className='bg-gray-800 w-full p-4 border-b-2 border-gray-950'>
        <div className='flex flex-row  justify-between'>
          <p className='font-semibold'>{title}</p>
          <div className='cursor-pointer' onClick={() => togglePanel('')}>
            <IoCloseOutline className='h-6 w-6' />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default SidePanel;
