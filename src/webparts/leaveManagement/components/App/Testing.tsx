/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState } from 'react';
export default function Testing() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Increase
      </button>
      <p>{count}</p>
      <button
        onClick={() => {
          setCount(count - 1);
          if (count < 0) {
            setCount(0);
          }
        }}
      >
        Decrease
      </button>
      {count % 2 === 0 ? <div>Even</div> : <div>Odd</div>}
    </div>
  );
}
