import React, { useState } from 'react';
import SidePanel from '@/components/sidePanel';
import { useRoomCallContext } from '@/context/roomCallContext';
import { Snackbar } from '@material-ui/core';
import { MdContentCopy } from 'react-icons/md';

export default function MeetingDetailsPanel() {
  const { roomId, clientURL, participants } = useRoomCallContext();
  const [openSB, setOpenSB] = useState(false);
  const meetingLink = `${clientURL}/room/${roomId}`;

  return (
    <SidePanel title='Meeting Details' name='meeting-details'>
      <div className='flex flex-col space-y-2 p-3 text-sm'>
        <div className='flex flex-col space-y-1 py-2 px-3 bg-gray-850 rounded'>
          <p className='font-semibold'>Meeting ID</p>
          <p className='font-light'>{roomId}</p>
        </div>
        <div className='flex flex-col space-y-1 py-2 px-3 bg-gray-850 rounded'>
          <p className='font-semibold'>Meeting Link</p>
          <div
            className='flex flex-row space-x-2 items-center cursor-pointer'
            onClick={() => {
              navigator.clipboard.writeText(meetingLink);
              setOpenSB(true);
            }}
          >
            <p className='font-light underline text-blue-400'>{meetingLink}</p>
            <MdContentCopy className='text-gray-300' />
          </div>
        </div>
        <div className='flex flex-col space-y-1 py-2 px-3 bg-gray-850 rounded'>
          <p className='font-semibold'>Participants</p>
          <p className='font-light'>{participants.length + 1}</p>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={1000}
        open={openSB}
        onClose={() => setOpenSB(false)}
        message='Link copied!'
      />
    </SidePanel>
  );
}
