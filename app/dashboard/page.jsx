'use client';
import React from 'react';
import DashboardLayout from './layout';
import { Button } from '../components/ui/button';
import CreateForm from './_components/CreateForm';
import FormList from './_components/FormList';
import { Skeleton } from '../components/ui/skeleton';

const Dashboard = () => {
  return (
    <div className="p-10 h-full">
      <h2 className="font-bold text-3xl flex items-center justify-between">
        Dashboard
        <CreateForm />
      </h2>

      {/* List of Forms  */}
      <div className="h-full bg-white">
        <FormList />
      </div>
    </div>
  );
};

export default Dashboard;
