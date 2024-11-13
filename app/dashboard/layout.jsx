'use client';
import { SignIn, SignedIn } from '@clerk/nextjs';
import React from 'react';
import SideNav from './_components/SideNav';

const DashboardLayout = ({ children }) => {
  return (
    // <SignedIn>
    <div className=" bg-white">
      <div className="md:w-64 fixed">
        <SideNav />
      </div>
      <div className="md:ml-64 bg-white">{children}</div>
    </div>
    // </SignedIn>
  );
};

export default DashboardLayout;
