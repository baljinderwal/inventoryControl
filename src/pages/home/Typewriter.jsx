import React from 'react';
import Typewriter from 'typewriter-effect';

const TypewriterComponent = () => {
  return (
    <Typewriter
      options={{
        strings: ['Track Stock.', 'Manage Orders.', 'Boost Efficiency.'],
        autoStart: true,
        loop: true,
      }}
    />
  );
};

export default TypewriterComponent;
