import React, { useEffect, useState, forwardRef } from 'react';

const ChatPanel = forwardRef(({ chats, addChat }, socketRef) => {
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   console.log(message);
  // }, [message]);

  const sendMessage = () => {
    if (message === '') return;
    addChat(message);
    socketRef.current.emit('send-message', message);
    setMessage('');
  };

  return (
    <div className='flex flex-col bg-white w-80 absolute top-24 right-0 bottom-20 border-l-2'>
      <div className='bg-indigo-100 w-full p-5'>
        <div className='flex flex-row space-x-2'>
          <p className='font-semibold text-indigo-600'>Meeting ID:</p>
          <p>{'xyz123'}</p>
        </div>
        <div className='flex flex-row space-x-2'>
          <p className='font-semibold text-indigo-600'>Participants:</p>
          <p>{4}</p>
        </div>
      </div>
      <div id='chat-window' className='flex-1'>
        {chats.map((msg, idx) => (
          <div key={idx}>
            <p>{msg}</p>
          </div>
        ))}
      </div>
      <div className='flex flex-row justify-evenly my-2'>
        <input
          type='text'
          className='border-2 bg-gray-100 rounded w-56 text-base px-3 py-2'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button type='submit' className='btn-light' onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
});

export default ChatPanel;

// const ChatPanel = ({socketRef}) => {
//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState([]);

//   // useEffect(() => {
//   //   console.log(message);
//   // }, [message]);

//   // useEffect(() => {
//   //   console.log(chat);
//   // }, [chat]);

//   const sendMessage = () => {
//     if (message === '') return;
//     setChat((chats) => [...chats, message]);
//     socketRef.current.emit('send-message', message);
//     setMessage('');
//   };

//   return (
//     <div className='flex flex-col bg-white w-80 absolute top-24 right-0 bottom-20 border-l-2'>
//       <div className='bg-indigo-100 w-full p-5'>
//         <div className='flex flex-row space-x-2'>
//           <p className='font-semibold text-indigo-600'>Meeting ID:</p>
//           <p>{'xyz123'}</p>
//         </div>
//         <div className='flex flex-row space-x-2'>
//           <p className='font-semibold text-indigo-600'>Participants:</p>
//           <p>{4}</p>
//         </div>
//       </div>
//       <div id='chat-window' className='flex-1'>
//         {chat.map((msg, idx) => (
//           <div key={idx}>
//             <p>{msg}</p>
//           </div>
//         ))}
//       </div>
//       <div className='flex flex-row justify-evenly my-2'>
//         <input
//           type='text'
//           className='border-2 bg-gray-100 rounded w-56 text-base px-3 py-2'
//           onChange={(e) => setMessage(e.target.value)}
//           value={message}
//         />
//         <button type='submit' className='btn-light' onClick={sendMessage}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPanel;
