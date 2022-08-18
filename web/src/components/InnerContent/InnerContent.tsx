import React from 'react';
import { Outlet } from 'react-router-dom';

function InnerContent() {
  return (
    <Outlet />
  );
}

export default InnerContent;
