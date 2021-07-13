import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { MdContentCopy } from 'react-icons/md';
import { IoSendSharp } from 'react-icons/io5';

import SidePanel from '@/components/Panels/SidePanel';
import url from '@/lib/url';
import sendInvite from '@/lib/utils/emailInvite';
import { useRoomContext } from '@/context/RoomContext';
import { useSocketContext } from '@/context/SocketContext';
import { netQualConfig } from '@/lib';

export default function InfoPanel() {
  const { participants, userNetQual } = useRoomContext();
  const { roomId, user } = useSocketContext();
  const [email, setEmail] = useState('');
  const [openSB, setOpenSB] = useState(false);
  const [openIS, setOpenIS] = useState(false);
  const meetingLink = `${url.client}/room/${roomId}`;

  const handleInvite = (e) => {
    e.preventDefault();
    const data = {
      sender: user.email,
      receiver: email,
      senderName: user.name,
      receiverName: email,
      roomId,
      meetingLink,
    };
    sendInvite(data);
    setOpenIS(true);
    setEmail('');
  };

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
        {userNetQual && (
          <div className='flex flex-col space-y-1 py-2 px-3 pb-3 bg-gray-850 rounded'>
            <p className='font-semibold'>Network Quality</p>
            <p>
              {netQualConfig[userNetQual].label} - {userNetQual * 20}%
            </p>
            <div className='h-2 rounded bg-white overflow-hidden'>
              {(() => {
                switch (userNetQual) {
                  case 1:
                    return (
                      <div
                        style={{ width: userNetQual * 20 + '%' }}
                        className='h-full bg-red-500'
                      ></div>
                    );
                  case 2:
                    return (
                      <div
                        style={{ width: userNetQual * 20 + '%' }}
                        className='h-full bg-orange-400'
                      ></div>
                    );
                  case 3:
                    return (
                      <div
                        style={{ width: userNetQual * 20 + '%' }}
                        className='h-full bg-yellow-300'
                      ></div>
                    );
                  case 4:
                    return (
                      <div
                        style={{ width: userNetQual * 20 + '%' }}
                        className='h-full bg-lime-500'
                      ></div>
                    );
                  case 5:
                    return (
                      <div
                        style={{ width: userNetQual * 20 + '%' }}
                        className='h-full bg-green-500'
                      ></div>
                    );
                }
              })()}
              <div className='hidden bg-gray-400'></div>
            </div>
          </div>
        )}
        <div className='flex flex-col space-y-1 py-2 px-3 bg-gray-850 rounded'>
          <p className='font-semibold'>Invite Users</p>
          <p className='font-light'>
            Enter a user's email to invite them to this meeting.
          </p>
          <form className='flex flex-row space-x-2' onSubmit={handleInvite}>
            <input
              type='text'
              name='email'
              className='text-box p-1 bg-gray-700'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <button type='submit' className=''>
              <IoSendSharp className='text-gray-600 hover:text-blue-400 w-5 h-5' />
            </button>
          </form>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={1000}
        open={openSB}
        onClose={() => setOpenSB(false)}
        message='Link copied!'
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={1000}
        open={openIS}
        onClose={() => setOpenIS(false)}
        message='Invite Sent Successfully!'
      />
    </SidePanel>
  );
}
