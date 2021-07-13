import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { MdContentCopy } from 'react-icons/md';
import { IoCloseOutline, IoSendSharp, IoVideocam } from 'react-icons/io5';
import { AiOutlineHistory } from 'react-icons/ai';

import sendInvite from '@/lib/utils/emailInvite';
import { useSocketContext } from '@/context/SocketContext';
import classNames from 'classnames';

export default function ChatSessionPanel({ sidePanel, setSidePanel }) {
  const { usersList, clearChatHistory, roomId, user } = useSocketContext();
  const [email, setEmail] = useState('');
  const [openSB, setOpenSB] = useState(false);
  const [openIS, setOpenIS] = useState(false);
  const meetingLink = `/room/${roomId}/chat`;

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

  const handleStartMeeting = () => {
    window.location.href = `/room/${roomId}`;
  };

  const handleClearChat = () => {
    const response = window.confirm(
      'Are you sure you want to permanently delete the chat history?'
    );
    if (response) {
      clearChatHistory(roomId);
    }
  };

  return (
    <div
      className={classNames(
        'flex flex-col bg-gray-900 border-l border-gray-950 text-gray-200 w-screen md:w-80',
        {
          hidden: !sidePanel,
          flex: sidePanel,
        }
      )}
      style={{
        height: 'calc(100vh - 5rem)',
      }}
    >
      <div className='bg-gray-800 w-full p-4 border-b-2 border-gray-950'>
        <div className='flex flex-row  justify-between'>
          <p className='font-semibold'>Information</p>
          <div className='cursor-pointer' onClick={() => setSidePanel(false)}>
            <IoCloseOutline className='h-6 w-6' />
          </div>
        </div>
      </div>
      <div className='flex flex-col space-y-3 p-3 text-sm'>
        <div className='flex flex-col space-y-1 py-2 px-3 bg-gray-850 rounded'>
          <p className='font-semibold'>Room ID</p>
          <p className='font-light'>{roomId}</p>
        </div>
        <div className='flex flex-col space-y-1 py-2 px-3 bg-gray-850 rounded'>
          <p className='font-semibold'>Session Link</p>
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
          <p className='font-light'>{usersList.length}</p>
        </div>
        <div className='flex flex-col space-y-1 py-2 px-3 bg-gray-850 rounded'>
          <p className='font-semibold'>Invite Users</p>
          <p className='font-light'>
            Enter a user's email to invite them to this chat session.
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
        <button className='btn' onClick={handleStartMeeting}>
          <IoVideocam className='btn-icon' />
          Start Meeting
        </button>
        <button className='btn' onClick={handleClearChat}>
          <AiOutlineHistory className='btn-icon' />
          Clear Chat History
        </button>
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
    </div>
  );
}
