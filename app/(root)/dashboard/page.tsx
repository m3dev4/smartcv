"use client"
import { signOut } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import React from 'react';

const DashboardPage = () => {
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    router.push('/');
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
