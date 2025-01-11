'use client';
import { eq } from 'drizzle-orm';
import { useEffect, useRef, useState } from 'react';
import CardGrid from '../../_components/CardGrid';
import Header from '../../_components/Header';
import SetUpGame from '../../_components/SetUpGame';
import TeamCard from '../../_components/TeamCard';
import { generateRandomWords } from '../../_utils/generateWords';
import { db } from '../../configs';
import { RoomWordList } from '../../configs/schema';
import React from 'react';
import NickNameBox from '../../_components/NickNameBox';
import fetchWords from '../../_utils/fetchWords';
import { useSocket } from '../../context/SocketContext';
import handleCreateRoom from '../../_utils/handleCreateRoom';

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

  const [redTeamCard, setRedTeamCard] = useState(0);
  const [blueTeamCard, setBlueTeamCard] = useState(0);

  const [counter, setCounter] = useState(0);

  const [team, setTeam] = useState(null);
  const [role, setRole] = useState(null);
  const [activeTeam, setActiveTeam] = useState(null);
  
  useEffect(() => {
    const name = JSON.parse(localStorage.getItem('nickName'));
    if (!name) {
      let user = {
        nickName: name,
        team: null,
        type: null,
      };
    }
    window.localStorage.setItem('user', JSON.stringify(user));
  }, [roomId]);

  const handleActiveTeam = ({ team }) => {
    if (team === 'red') {
      setActiveTeam('blue');
    } else {
      setActiveTeam('red');
    }
  };

  const handleFetchWords = ({ roomId }) => {
    fetchWords(roomId)
      .then((roomData) => {
        setActiveTeam(roomData.teamTurn);

        setRedTeamCard(roomData.redCardRemaining);
        setBlueTeamCard(roomData.blueCardRemaining);

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
    const updateDBTeamTurn = async ({ team_ }) => {
      console.log(team_);

      await db
        .update(RoomWordList)
        .set({ teamTurn: team_ })
        .where(eq(RoomWordList.roomId, roomId));

      return { success: true, message: 'team updated successfully' };
    };

    const handleActiveTeamTurn = (team_) => {
      setActiveTeam(team_.team);
      updateDBTeamTurn({ team_: team_.team });
    };

    if (activeTeam && socket) {
      socket.on('updated-team-turn', handleActiveTeamTurn);
    }

    return () => {
      // socket.off('updated-team-turn', handleActiveTeamTurn);
    };
  }, [activeTeam, socket]);

  const updateDBTeamRemainingWord = async ({
    teamName_,
    remainingCard,
    roomId,
  }) => {
    try {
      const result = await db
        .update(RoomWordList)
        .set({ [teamName_]: remainingCard })
        .where(eq(RoomWordList.roomId, roomId));

      return { success: true, message: 'Word revealed successfully' };
    } catch (error) {
      console.error('Error updating team remaining word:', error.message);
      return { success: false, message: 'Failed to reveal word.' };
    }
  };

  const handleCardRemaining = ({ userTeam, cardClicked }) => {
    if (cardClicked !== 'grey' && cardClicked !== 'black') {
      const teamKey =
        userTeam === 'red' ? 'redCardRemaining' : 'blueCardRemaining';
      const updateState = userTeam === 'red' ? setRedTeamCard : setBlueTeamCard;

      updateState((prev) => {
        const updatedCount = prev - 1;
        updateDBTeamRemainingWord({
          teamName_: teamKey,
          remainingCard: updatedCount,
          roomId,
        });
        socket.emit('update-remaining-team-card', { roomId });
        return updatedCount;
      });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('updated-remaining-team-card', ({ roomId }) => {
        console.log('emit 2');
        handleFetchWords({ roomId });
      });
    }
  }, [socket, redTeamCard, blueTeamCard]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        // console.log('Socket connected:', socket.id);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (!socket || !roomId || !nickName) return;

    socket.emit('join-socket-room', { roomId, nickName });

    const handleInitialState = ({
      redTeam,
      redSpyMaster,
      blueTeam,
      blueSpyMaster,
      connectedUsers,
    }) => {
      setRedTeam(redTeam);
      setRedSpyMaster(redSpyMaster);
      setBlueTeam(blueTeam);
      setBlueSpyMaster(blueSpyMaster);
    };

    const handleNewUser = ({ userId, team, type, nickName }) => {
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
      // console.log('Room info received:', { roomId, clients });
    };

    // socket.on('room-state', handleRoomState);
    socket.on('initial-state', handleInitialState);
    socket.on('new-user', handleNewUser);
    socket.on('user-disconnected', handleUserDisconnected);
    socket.on('room-info', handleRoomInfo);

    socket.on('join-confirmed', ({ roomId }) => {
      // console.log('Join confirmed for room:', roomId);
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

  const handleStartGame = async () => {
    const words = generateRandomWords({ count: 25, containerWidth: 134.05 });

    if (words) {
      let resp = await handleCreateRoom({
        RoomWordList,
        roomId,
        words: words.words,
        nickName,
        blueCount: words.blueCount,
      });
      if (resp) {
        setGameStarted(true);
      }
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
    updateUserStatus(team, type);
    RemoveFromOtherTeams({ team, type });
    setUser(JSON.parse(localStorage.getItem('user')));

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
                color={'#8f2b1c'}
                players={redTeam}
                spyMaster={redSpyMaster}
                team={'red'}
                handleOperative={handleOperative}
                nickName={nickName}
                gameStarted={gameStarted}
                activeTeam={activeTeam}
                teamCardNumber={redTeamCard}
                handleCardRemaining={handleCardRemaining}
              />
            </div>

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
                  activeTeam={activeTeam}
                  handleActiveTeam={handleActiveTeam}
                  handleCardRemaining={handleCardRemaining}
                  redSpyMaster={redSpyMaster}
                  blueSpyMaster={blueSpyMaster}
                  handleFetchWords={handleFetchWords}
                />
              )}
            </div>

            <div>
              <TeamCard
                img={
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVFfNXTksdjdov2scvVyNW0umbI8R0WSZYtA&s'
                }
                flex={'flex-row-reverse'}
                color={'#3284a3'}
                players={blueTeam}
                spyMaster={blueSpyMaster}
                team={'blue'}
                handleOperative={handleOperative}
                nickName={nickName}
                gameStarted={gameStarted}
                activeTeam={activeTeam}
                teamCardNumber={blueTeamCard}
                handleCardRemaining={handleCardRemaining}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomPage;
