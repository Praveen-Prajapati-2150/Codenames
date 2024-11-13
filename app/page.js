'use client';
import Image from 'next/image';
import Hero from './_components/Hero';
import { SocketProvider } from './context/SocketContext';

export default function Home() {
  return (
    // <SocketProvider>
      <main className="bg-white">
        <Hero />
      </main>
    // </SocketProvider>
  );
}
