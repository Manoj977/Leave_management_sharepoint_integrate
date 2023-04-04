/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';

interface IHomeProps {}
export default function Home(props: IHomeProps) {
  return (
    <div className="">
        <div className="bg-blue-500  p-4">
      <h1 className="text-white text-2xl">Hello, world!</h1>
    </div>
      <h1>Welcome to the Home page!</h1>
      <p>This is some sample text for the Home page.</p>
    </div>
  );
}