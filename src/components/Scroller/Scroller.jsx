import React, { useRef, useEffect } from 'react';

const Scroller = () => {
  // a component that always scrolls into visibility
  // used for chat windows

  const elementRef = useRef();

  useEffect(() => elementRef.current.scrollIntoView());

  return <div ref={elementRef} />;
};

export default Scroller;
