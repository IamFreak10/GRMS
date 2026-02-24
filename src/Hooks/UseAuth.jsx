import React, { use } from 'react';
import { AuthContext } from '../Context/AutContext';

export default function UseAuth() {
  const authInfo = use(AuthContext);
  return authInfo;
}
