import React from 'react';
import { BiMicrophoneOff, BiVideoOff, BiPhone } from 'react-icons/bi';

export default function CallFooter() {
  return (
    <footer className='h-20 absolute bottom-0 left-0 w-full bg-indigo-200 p-4 flex flex-row items-center justify-center space-x-10 border-t border-indigo-300'>
      <div className='call-icon-wrapper active'>
        <BiMicrophoneOff className='call-icon ' />
      </div>
      <div className='call-icon-wrapper'>
        <BiVideoOff className='call-icon' />
      </div>
      <div className='call-icon-wrapper phn'>
        <BiPhone className='call-icon' />
      </div>
    </footer>
  );
}
