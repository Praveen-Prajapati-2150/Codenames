// RoomManager.js
class RoomManager {
    
  constructor() {
    this.rooms = new Map();
  }

  joinRoom(roomId, clientId, team, type) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Map());
    }

    const room = this.rooms.get(roomId);
    room.set(clientId, { team, type });

    return room;
  }

  leaveRoom(roomId, clientId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(clientId);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  updateTeamOrRole(roomId, clientId, oldTeam, newTeam, oldType, newType) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.set(clientId, { team: newTeam, type: newType });
    }
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }
}

export default RoomManager;
