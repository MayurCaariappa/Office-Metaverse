import type { PlayerState } from "../types/contracts";

interface RoomPlayer extends PlayerState {
  ws: unknown;
}

export class PlayerRegistry {
  private readonly rooms = new Map<string, Map<string, RoomPlayer>>();

  add(roomId: string, player: RoomPlayer) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Map());
    }

    this.rooms.get(roomId)!.set(player.id, player);
  }

  update(roomId: string, playerId: string, position: PlayerState["position"]) {
    const room = this.rooms.get(roomId);

    if (!room?.has(playerId)) {
      return;
    }

    const player = room.get(playerId)!;
    player.position = position;
    room.set(playerId, player);
  }

  remove(roomId: string, playerId: string) {
    const room = this.rooms.get(roomId);

    if (!room) {
      return;
    }

    room.delete(playerId);

    if (room.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  list(roomId: string): PlayerState[] {
    return Array.from(this.rooms.get(roomId)?.values() ?? []).map((entry) => ({
      id: entry.id,
      position: entry.position,
    }));
  }
}
