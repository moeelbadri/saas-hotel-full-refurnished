"use client";
import { useState, useEffect, useRef } from 'react';

const useDirection = (initDirection = 'ltr') => {
  
  const [direction, setDirection] = useState(initDirection);
  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
  }, [direction]);

  return { direction, setDirection };
};

export default useDirection;
