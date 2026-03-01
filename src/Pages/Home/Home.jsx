import React from 'react';
import UseAuth from '../../Hooks/UseAuth';

export default function Home() {
  const { user } = UseAuth();
  console.log(user);
  return (
    <div>
      <h1>Home</h1>
      <p>{user?.email}</p>
    </div>
  );
}
