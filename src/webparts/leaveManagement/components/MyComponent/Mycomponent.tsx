/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const MyWebPart: React.FC = () => {
  const handleButtonClick = () => {
    toast.success('Hello, World!');
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Click Me</button>
      <ToastContainer />
    </div>
  );
};

export default MyWebPart;
