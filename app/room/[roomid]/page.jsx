'use client';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { db } from '../../configs/index';
import { JsonForms, RoomWordList } from '../../configs/schema';
import FormUi from '../../edit-form/_components/FormUi';
import SetUpGame from '../../_components/SetUpGame';
import TeamCard from '../../_components/TeamCard';
import CardGrid from '../../_components/CardGrid';
import Header from '../../_components/Header';
import { useRouter } from 'next/navigation';
import { generateRandomWords } from '../../_utils/generateWords';
import io from 'socket.io-client';
import { toast } from 'sonner';
// import { socket } from '../../configs/socket';
import React, { useMemo } from 'react';
import fetchWords from '../../_utils/fetchWords';
import NickNameBox from '../../_components/NickNameBox';
import { useSocket } from '../../context/SocketContext';

const RoomPage = ({ params }) => {
  const { roomid: roomId } = params;

  const childRef = useRef();
  const socket = useSocket();

  const [gameStarted, setGameStarted] = useState(null);
  const [nickName, setNickName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  // const [user, setUser] = useState();

  const [redTeam, setRedTeam] = useState(['Alone', 'Stone', 'Shapit', 'Notme']);
  const [redSpyMaster, setRedSpyMaster] = useState(['Boomer']);

  const [blueTeam, setBlueTeam] = useState([
    'Aurora',
    'Virus',
    'Chandan',
    'Vimbal',
  ]);
  const [blueSpyMaster, setBlueSpyMaster] = useState([]);

  const [counter, setCounter] = useState(0);

  const [team, setTeam] = useState(null);
  const [role, setRole] = useState(null);

  const handleFetchWords = ({ roomId }) => {
    fetchWords(roomId)
      .then((roomData) => {
        if (roomData.isGameStarted === 'started') {
          setGameStarted(roomData.isGameStarted);
        } else {
          setGameStarted(null);
        }
      })
      .catch((error) => {
        console.error('Error fetching words:', error);
      });
  };

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
  }, [socket]);

  // Set up socket event listeners ONCE
  useEffect(() => {
    if (socket) {
      const handleAdd = () => setCounter((prev) => prev + 1);
      const handleMinus = () => setCounter((prev) => prev - 1);

      socket.on('add', handleAdd);
      socket.on('minus', handleMinus);

      return () => {
        socket.off('add', handleAdd);
        socket.off('minus', handleMinus);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (!socket || !roomId || !nickName) return;

    // Join socket room on component mount
    console.log(roomId, nickName);
    socket.emit('join-socket-room', { roomId, nickName });

    // Listen for initial room state
    const handleInitialState = ({
      redTeam,
      redSpyMaster,
      blueTeam,
      blueSpyMaster,
      connectedUsers,
    }) => {
      console.log('Received initial state:', {
        redTeam,
        redSpyMaster,
        blueTeam,
        blueSpyMaster,
        connectedUsers,
      });
      setRedTeam(redTeam);
      setRedSpyMaster(redSpyMaster);
      setBlueTeam(blueTeam);
      setBlueSpyMaster(blueSpyMaster);
    };

    const handleNewUser = ({ userId, team, type, nickName }) => {
      // console.log('New user event received:', { userId, team, type, nickName });

      // Don't update if it's the current user
      if (userId === socket.id) {
        console.log('Ignoring new-user event for current user');
        return;
      }

      // Remove user from all teams first
      const removeFromAllTeams = () => {
        setRedTeam((prevTeam) => prevTeam.filter((name) => name !== nickName));
        setRedSpyMaster((prevTeam) =>
          prevTeam.filter((name) => name !== nickName)
        );
        setBlueTeam((prevTeam) => prevTeam.filter((name) => name !== nickName));
        setBlueSpyMaster((prevTeam) =>
          prevTeam.filter((name) => name !== nickName)
        );
      };

      // Remove from all teams first
      removeFromAllTeams();

      if (team === 'red') {
        if (type === 'operative') {
          setRedTeam((prevTeam) => [...prevTeam, nickName]);
        } else if (type === 'spymaster') {
          setRedSpyMaster((prevSpyMaster) => [...prevSpyMaster, nickName]);
        }
      } else {
        if (type === 'operative') {
          setBlueTeam((prevTeam) => [...prevTeam, nickName]);
        } else if (type === 'spymaster') {
          setBlueSpyMaster((prevSpyMaster) => [...prevSpyMaster, nickName]);
        }
      }
    };

    const handleUserDisconnected = ({
      userId,
      nickName,
      redTeam,
      redSpyMaster,
      blueTeam,
      blueSpyMaster,
    }) => {
      console.log(`User ${userId} (${nickName}) has disconnected`);

      setRedTeam(redTeam);
      setRedSpyMaster(redSpyMaster);
      setBlueTeam(blueTeam);
      setBlueSpyMaster(blueSpyMaster);
    };

    // Add listener for room-info events
    const handleRoomInfo = ({ roomId, clients }) => {
      console.log('Room info received:', { roomId, clients });
    };

    // socket.on('room-state', handleRoomState);
    socket.on('initial-state', handleInitialState);
    socket.on('new-user', handleNewUser);
    socket.on('user-disconnected', handleUserDisconnected);
    socket.on('room-info', handleRoomInfo);

    socket.on('join-confirmed', ({ roomId }) => {
      console.log('Join confirmed for room:', roomId);
    });

    return () => {
      // console.log('Cleaning up socket listeners');
      // socket.off('room-state', handleRoomState);
      socket.off('initial-state', handleInitialState);
      socket.off('new-user', handleNewUser);
      socket.off('room-info', handleRoomInfo);
      socket.off('join-confirmed');
    };
  }, [socket, roomId, nickName]);

  useEffect(() => {
    if (roomId && nickName) {
      handleFetchWords({ roomId });
    }
  }, [roomId, nickName]);

  const handleClick = (type) => {
    // console.log('socket', socket);

    if (socket && socket.connected) {
      if (type === 'add') {
        socket.emit('add', 1);
      } else {
        socket.emit('minus', 1);
      }
    }
  };

  const checkGameStatus = () => {
    if (gameStarted === 'started') {
      if (roomId && nickName) {
        handleFetchWords({ roomId });
      }
    } else {
      setGameStarted(null);
      setRedTeam([...redTeam, ...redSpyMaster]);
      setBlueTeam([...blueTeam, ...blueSpyMaster]);
      setRedSpyMaster([]);
      setBlueSpyMaster([]);
    }
  };

  useEffect(() => {
    const name = JSON.parse(localStorage.getItem('nickName'));
    if (name) {
      setNickName(name);
    }
  }, []);

  const handleNickNameStorage = (name) => {
    if (name) {
      setNickName(name);
      window.localStorage.setItem('nickName', JSON.stringify(name));
    }
  };

  const handleCreateRoom = async (words) => {
    setLoading(true);

    try {
      const resp = await db
        .insert(RoomWordList)
        .values({
          uniqueId: roomId,
          isGameStarted: 'started',
          roomId: roomId,
          wordList: words,
          createdBy: nickName,
        })
        .returning({ id: RoomWordList.id });

      console.log('createroom resp', resp);

      if (resp[0].id) {
        console.log({ gameStarted });
        setGameStarted(true);
      }

      console.log('Room created with ID:', resp[0].id);
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    const words = generateRandomWords(25, 134.05);

    if (words) {
      handleCreateRoom(words);
    }
  };

  const RemoveFromOtherTeams = ({ team, type }) => {
    setRedSpyMaster(redSpyMaster.filter((t) => t !== nickName));
    setRedTeam(redTeam.filter((t) => t !== nickName));
    setBlueSpyMaster(blueSpyMaster.filter((t) => t !== nickName));
    setBlueTeam(blueTeam.filter((t) => t !== nickName));
  };

  const updateUserStatus = (team, type) => {
    let obj = {
      team: team,
      type: type,
      nickName: nickName,
    };
    localStorage.setItem('user', JSON.stringify(obj));
  };

  const handleOperative = ({ team, type }) => {
    setTeam(team);
    setRole(type);
    handleOperativeMain({ team, type });
  };

  const handleOperativeMain = ({ team, type }) => {
    // console.log(team, type);

    updateUserStatus(team, type);
    RemoveFromOtherTeams({ team, type });
    setUser(JSON.parse(localStorage.getItem('user')));

    // console.log(socket, socket.connected, roomId, team, type, nickName);
    if (socket && socket.connected && roomId && team && type && nickName) {
      try {
        socket.emit('join-room', { roomId, team, type, nickName });
      } catch (error) {
        console.error('Error emitting join-room event:', error);
      }
    } else {
      console.error('Socket not connected or missing details');
    }

    if (team === 'red') {
      if (type === 'operative' && !redTeam.includes(nickName)) {
        setRedTeam([...redTeam, nickName]);
      } else if (type === 'spymaster' && !redSpyMaster.includes(nickName)) {
        setRedSpyMaster([...redSpyMaster, nickName]);
      }
    } else {
      if (type === 'operative' && !blueTeam.includes(nickName)) {
        setBlueTeam([...blueTeam, nickName]);
      } else if (type === 'spymaster' && !blueSpyMaster.includes(nickName)) {
        setBlueSpyMaster([...blueSpyMaster, nickName]);
      }
    }
  };

  return (
    <div className="flex flex-col items-start justify-between w-full h-[100vh] ">
      {!nickName ? (
        // <h1>enter your nickname</h1>

        <div className="w-screen flex items-center justify-center">
          <NickNameBox
            roomId={roomId}
            nickName={nickName}
            handleNickNameStorage={handleNickNameStorage}
          />
        </div>
      ) : (
        <>
          <div className="w-full">
            <Header roomId={roomId} checkGameStatus={checkGameStatus} />
          </div>

          <div className="flex items-start justify-between w-full h-[90vh] pt-5 px-20">
            <div>
              <TeamCard
                img={
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDvnwFlyxtBhCjjnTQGPN1ZWOifp_ByZ6PYQ&s'
                }
                flex={'flex'}
                color={'#561909'}
                players={redTeam}
                spyMaster={redSpyMaster}
                team={'red'}
                handleOperative={handleOperative}
                nickName={nickName}
                gameStarted={gameStarted}
              />
            </div>

            {/* <div className="h-screen flex justify-center items-center flex-col">
              <h1 className="text-5xl font-bold">{counter}</h1>
              <div className="flex space-x-4 items-center mt-10">
                <button
                  className="py-2 px-6  rounded-md bg-green-400 text-white"
                  onClick={() => handleClick('add')}
                >
                  Add
                </button>
                <button
                  className="py-2 px-6 rounded-md bg-red-400 text-white"
                  onClick={() => handleClick('minus')}
                >
                  Minus
                </button>
              </div>
            </div> */}

            <div>
              {!gameStarted ? (
                <SetUpGame handleStartGame={handleStartGame} />
              ) : (
                <CardGrid
                  // handleGenerateWords={handleGenerateWords}
                  ref={childRef}
                  gameStarted={gameStarted}
                  roomId={roomId}
                  user={user}
                  nickName={nickName}
                />
              )}
            </div>

            <div>
              <TeamCard
                img={
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVFfNXTksdjdov2scvVyNW0umbI8R0WSZYtA&s'
                }
                flex={'flex-row-reverse'}
                color={'#103c4b'}
                players={blueTeam}
                spyMaster={blueSpyMaster}
                team={'blue'}
                handleOperative={handleOperative}
                nickName={nickName}
                gameStarted={gameStarted}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomPage;
