import React from 'react';

import SidePanel from '@/components/Panels/SidePanel';
import { useSocketContext } from '@/context/SocketContext';

function ParticipantsPanel() {
  const { user, usersList } = useSocketContext();

  return (
    <SidePanel title='Participants' name='participants'>
      <ul className='flex-1 text-gray-200 text-sm p-3 overflow-y-scroll flex flex-col space-y-2'>
        {usersList.map((usr) => (
          <li
            key={usr.id}
            className='flex flex-row items-center space-x-4 text-gray-200 p-2 bg-gray-850 rounded py-2 px-3 border-l-2'
            style={{ borderLeftColor: usr.color }}
          >
            <img src={usr.image} className='w-12 h-12 rounded-full' />
            <div>
              <p className='font-semibold'>
                {usr.name} {user.id === usr.id ? '(You)' : ''}
              </p>
              <p>{usr.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </SidePanel>
  );
}

export default ParticipantsPanel;
