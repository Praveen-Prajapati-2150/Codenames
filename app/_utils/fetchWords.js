import React from 'react';
import { db } from '../configs';
import { RoomWordList } from '../configs/schema';
import { eq } from 'drizzle-orm';

const fetchWords = async (roomId) => {
  // console.log({ roomId });

  try {
    const result = await db
      .select()
      .from(RoomWordList)
      .where(eq(RoomWordList.roomId, roomId))
      .execute();

    // console.log(result);

    if (result.length > 0) {
      // let latestRoom = [...result].sort((a, b) => b.id - a.id)[0];

      // get room be the latest date of creation

      // console.log(result);

      let latestRoom = [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      // console.log(latestRoom);
      // console.log('Fetched Room Data:', roomData.roomId);

      return latestRoom;
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
