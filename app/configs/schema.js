import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  references,
  boolean,
  array,
  jsonb,
} from 'drizzle-orm/pg-core';

export const RoomWordList = pgTable('create_room', {
  id: serial('id').primaryKey(),
  uniqueId: varchar('uniqueId').notNull(),
  isGameStarted: varchar('isGameStarted').notNull(),
  roomId: text('roomId').notNull(),
  wordList: jsonb('word').notNull().default([]),
  createdBy: varchar('createdBy').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  teamTurn: text('teamTurn').notNull(),
  blueCardRemaining: text('blueCardRemaining').notNull(),
  redCardRemaining: text('redCardRemaining').notNull(),
});
