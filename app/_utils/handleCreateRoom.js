import React from 'react';
import { db } from '../configs';
import { RoomWordList } from '../configs/schema';

const handleCreateRoom = async ({
  RoomWordList,
  roomId,
  words,
  nickName,
  blueCount,
}) => {
  //   setLoading(true);

  try {
    const resp = await db
      .insert(RoomWordList)
      .values({
        uniqueId: roomId,
        isGameStarted: 'started',
        roomId: roomId,
        wordList: words,
        createdBy: nickName,
        teamTurn: blueCount === 9 ? 'blue' : 'red',
        blueCardRemaining: blueCount,
        redCardRemaining: blueCount === 8 ? 9 : 8,
      })
      .returning({ id: RoomWordList.id });

    // if (resp[0].id) {
    //   setGameStarted(true);
    // }

    return resp[0].id;
  } catch (error) {
    console.error('Error creating room:', error);
  } finally {
    // setLoading(false);
  }
};

export default handleCreateRoom;
