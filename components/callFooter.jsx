import React from 'react';
import {
  IoMicSharp,
  IoMicOffSharp,
  IoVideocamOff,
  IoVideocam,
  IoCall,
  IoChatbox,
} from 'react-icons/io5';
import { MdScreenShare } from 'react-icons/md';

export default function CallFooter() {
  return (
    <footer className='h-20 absolute bottom-0 left-0 w-full bg-gray-800 p-4 flex flex-row items-center justify-center space-x-10 border-t border-gray-600'>
      <div className='call-icon-wrapper active'>
        <IoMicOffSharp className='call-icon ' />
      </div>
      <div className='call-icon-wrapper'>
        <IoVideocamOff className='call-icon' />
      </div>
      <div className='call-icon-wrapper phn'>
        <IoCall className='call-icon' />
      </div>
    </footer>
  );
}
