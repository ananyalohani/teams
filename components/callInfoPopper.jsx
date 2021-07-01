import React, { useState } from 'react';
import { Popper, Snackbar } from '@material-ui/core';
import { useRoomCallContext } from '@/context/roomCallContext';
import { MdContentCopy } from 'react-icons/md';

function CallInfoPopper({ anchorEl, open }) {
  const { roomId, clientURL, participants } = useRoomCallContext();
  const meetingLink = `${clientURL}/room/${roomId}`;
  const [openSB, setOpenSB] = useState(false);

  return (
    <>
      <Popper
        open={open}
        anchorEl={anchorEl}
        className='popper flex flex-col space-y-1'
      >
        <div className='flex flex-row space-x-2 items-center'>
          <p className='font-semibold'>Meeting ID</p>
          <p className='font-light'>{roomId}</p>
        </div>
        <div className='flex flex-row space-x-2 items-center'>
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
        <div className='flex flex-row space-x-2 items-center'>
          <p className='font-semibold'>Participants</p>
          <p className='font-light'>{participants.length + 1}</p>
        </div>
      </Popper>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={1000}
        open={openSB}
        onClose={() => setOpenSB(false)}
        message='Link copied!'
      />
    </>
  );
}

export default CallInfoPopper;
