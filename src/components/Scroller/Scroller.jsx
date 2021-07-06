import React, { useRef, useEffect } from 'react';

const Scroller = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

export default Scroller;
