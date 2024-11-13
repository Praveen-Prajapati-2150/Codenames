// // useSocketConnection.js
// import { useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import { useSocket } from '../context/SocketContext';

// const useSocketConnection = (
//   roomId,
//   team,
//   type,
//   setCounter,
//   nickName,
//   setRedTeam,
//   setRedSpyMaster,
//   setBlueTeam,
//   setBlueSpyMaster
// ) => {
//   //   const socket = useRef(null);

//   const socket = useSocket();

//   useEffect(() => {
//     if (!socket.current) {
//       //   socket.current = io();

//       socket.current.on('add', (payload) => {
//         console.log('add', payload);
//         setCounter((prev) => prev + 1);
//       });

//       socket.current.on('minus', (payload) => {
//         setCounter((prev) => prev - 1);
//       });

//       socket.current.on('join-room', (data) => {
//         // Handle join-room event
//       });

//       //   socket.current.on('new-user', (data) => {
//       //     // Handle new-user event
//       //   });

//       socket.current.on('new-user', ({ userId, team, type, nickName }) => {
//         if (team === 'red') {
//           if (type === 'operative') {
//             setRedTeam((prevTeam) => [...prevTeam, nickName]);
//           } else if (type === 'spymaster') {
//             setRedSpyMaster((prevSpyMaster) => [...prevSpyMaster, nickName]);
//           }
//         } else {
//           if (type === 'operative') {
//             setBlueTeam((prevTeam) => [...prevTeam, nickName]);
//           } else if (type === 'spymaster') {
//             setBlueSpyMaster((prevSpyMaster) => [...prevSpyMaster, nickName]);
//           }
//         }
//       });

//       socket.current.on('user-left', (data) => {
//         // Handle user-left event
//       });

//       socket.current.on('user-switched', (data) => {
//         // Handle user-switched event
//       });
//     }

//     socket.current.emit('join-room', { roomId, team, type, nickName });

//     return () => {
//       if (socket.current) {
//         socket.current.emit('leave-room', { roomId, team, type, nickName });
//         socket.current.disconnect();
//       }
//     };
//   }, [
//     roomId,
//     team,
//     type,
//     setCounter,
//     nickName,
//     setRedTeam,
//     setRedSpyMaster,
//     setBlueTeam,
//     setBlueSpyMaster,
//   ]);

//   return socket;
// };

// export default useSocketConnection;
