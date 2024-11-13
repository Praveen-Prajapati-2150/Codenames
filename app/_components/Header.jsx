'use client';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { usePathname } from 'next/navigation';
import { User, Timer, Smile, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { db } from '../configs';
import { RoomWordList } from '../configs/schema';
import { eq } from 'drizzle-orm';

const Header = (props) => {
  const { roomId, checkGameStatus } = props;

  const [isOpen, setIsOpen] = useState(false);

  const [nickName, setNickName] = useState('');

  useEffect(() => {
    let name = JSON.parse(window.localStorage.getItem('nickName'));

    setNickName(name);
  }, []);

  const handleResetGame = () => {
    window.localStorage.removeItem('gameStarted');
    window.localStorage.removeItem('randomWords');

    let user = JSON.parse(localStorage.getItem('user'));
    // console.log(user)

    let obj = {
      team: user?.team,
      nickName: user?.nickName,
      type: 'operative',
    };
    localStorage.setItem('user', JSON.stringify(obj));
    // window.localStorage.removeItem('user');
    // checkGameStatus();
    // setIsOpen(false);

    updateGameStartedStatus(roomId, 'completed');
  };

  const updateGameStartedStatus = async (roomId, newStatus) => {
    console.log('Updating isGameStarted status for roomId:', roomId);

    try {
      const result = await db
        .update(RoomWordList)
        .set({ isGameStarted: newStatus })
        .where(eq(RoomWordList.roomId, roomId))
        .execute();

      console.log(`isGameStarted updated for roomId ${roomId} to ${newStatus}`);
      console.log('result', result);

      if (result) {
        checkGameStatus();
        setIsOpen(false);
      }

      return result;
    } catch (error) {
      console.error('Error updating isGameStarted status:', error);
      return null;
    }
  };

  const path = usePathname();

  return (
    <div className="p-5 border-b h-[10vh] shadow-sm flex items-center justify-between">
      <div className="flex items-center">
        <div>
          <Image src={'/logo2.svg'} alt="logo" width={100} height={45} />
        </div>
        <div className="pl-5 flex items-center">
          <Button>
            Players <User className="ml-1" size={20} />
            <span className="ml-1">1</span>
          </Button>
          <Button className="ml-2">
            <Timer size={20} />
          </Button>
        </div>
      </div>

      <div>
        <div className="pl-5 flex items-center">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="outline-none rounded-full">
              <Button className="mr-2">
                <RotateCcw className="mr-2" size={20} /> Reset Game
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px] bg-[#222222] rounded-xl outline-none">
              <DropdownMenuLabel className="text-center text-[10px] text-white">
                This table will be prepared for a new game.
              </DropdownMenuLabel>
              {/* <DropdownMenuSeparator /> */}
              <h1 className="text-red-500 pt-1 px-4 text-[10px] font-bold text-center bg-[#222222] hover:bg-[#222222]">
                Warning! This will reset the currently running game!
              </h1>
              <div className="pt-3 mb-2 flex items-center justify-center">
                <Button
                  onClick={handleResetGame}
                  size={'sm'}
                  className="bg-yellow-600"
                >
                  Confirm table reset
                </Button>{' '}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button>News</Button>
          <Button className="ml-2">Rules</Button>
          <Button className="ml-2">
            {nickName} <Smile className="ml-1" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
