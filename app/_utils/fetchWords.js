import React from 'react';
import { db } from '../configs';
import { RoomWordList } from '../configs/schema';
import { eq } from 'drizzle-orm';

const fetchWords = async (roomId) => {
  // console.log(roomId);

  try {
    const result = await db
      .select()
      .from(RoomWordList)
      .where(eq(RoomWordList.roomId, roomId))
      .execute();

    // console.log(result);

    if (result.length > 0) {
      // return result[result.length - 1].wordList;
      const roomData = result[result.length - 1];
      // console.log('Fetched Room Data:', roomData);

      return roomData;
    } else {
      console.error('No words found for this roomId');
      return [];
    }
  } catch (error) {
    console.error('Error fetching words:', error);
    return [];
  }
};

export default fetchWords;
