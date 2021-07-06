import React from 'react';

import SidePanel from '@/components/Panels/SidePanel';
import { virtualBackgroundImages as bg } from '@/lib';
import { MdBlurOn } from 'react-icons/md';
import { IoBanOutline } from 'react-icons/io5';
import { useBackgroundContext } from '@/context/BackgroundContext';

function BackgroundPanel() {
  const { changeUserBackground } = useBackgroundContext();

  return (
    <SidePanel title='Select Background' name='background'>
      <div className='p-2'>
        <div className='grid grid-cols-3 gap-2'>
          <div
            className='w-24 h-16 bg-gray-850 rounded-sm flex items-center justify-center active:border-2 active:border-blue-400'
            onClick={() => changeUserBackground(null)}
          >
            <IoBanOutline className='w-10 h-10' />
          </div>
          <div
            className='w-24 h-16 bg-gray-850 rounded-sm flex items-center justify-center active:border-2 active:border-blue-400'
            onClick={() => changeUserBackground('blur')}
          >
            <MdBlurOn className='w-12 h-12' />
          </div>
          {Object.keys(bg).map((key, idx) => (
            <img
              src={bg[key]}
              className='w-24 h-16 active:border-2 active:border-blue-400'
              key={idx}
              alt={key}
              onClick={() => changeUserBackground('virtual', bg[key])}
            />
          ))}
        </div>
      </div>
    </SidePanel>
  );
}

export default BackgroundPanel;
