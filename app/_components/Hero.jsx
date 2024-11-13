'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '../components/ui/skeleton';
// import { Card } from '../components/ui/card';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/button';
import generateRoomParam from '../_utils/generateUniqueParamId';
import NickNameBox from './NickNameBox';
import { Name } from 'drizzle-orm';

const Hero = () => {
  const roomId = generateRoomParam();
  const [nickName, setNickName] = useState('');

  const handleNickNameStorage = (name) => {
    if (name) {
      setNickName(name);
      window.localStorage.setItem('nickName', JSON.stringify(name));
    }
  };

  useEffect(() => {
    let name = JSON.parse(window.localStorage.getItem('nickName'));

    if (name) {
      setNickName(name);
    }
  }, []);

  return (
    <section className="bg-gray-50 ">
      <div className="mx-auto lg:flex flex lg:h-screen w-full overflow-hidden ">
        <div className="absolute flex flex-wrap">
          {Array.from({ length: 420 }).map((_, index) => (
            <div
              key={index}
              className={`
                border cursor-pointer
                bg-transparent
                h-[50px] w-[50px] flex-grow 
                text-gray-500 
                transition-all duration-500 ease-out
                transform 
                shadow-lg 
                shadow-blue-900
                hover:bg-[#a740ff]
                hover:duration-100
                hover:scale-110 hover:rotate-6 hover:translate-y-[-5px]
                hover:shadow-2xl 
                hover:shadow-blue-600
              `}
            />
          ))}
        </div>

        <div className="w-screen flex items-center justify-center">
          <NickNameBox
            roomId={roomId}
            nickName={nickName}
            handleNickNameStorage={handleNickNameStorage}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
