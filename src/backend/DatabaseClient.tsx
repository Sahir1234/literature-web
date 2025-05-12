
import { toast } from 'react-toastify';
import { get, ref } from "firebase/database";
import { GameStatus, PlayerData, PublicGameData } from '../model/GameData';
import { rtdb } from "./FirebaseUtils";
import { UNKNOWN_ERROR_MESSAGE } from '../utils/AlertMessages';
import { LocalStorageManager } from '../utils/LocalStorageManager';

export class DatabaseClient {

  static getPublicDataGameRef(gameId: string) {
    return ref(rtdb, `${gameId}/public`);
  }

  static getPlayerDataGameRef(gameId: string, uid: string) {
    return ref(rtdb, `${gameId}/private/${uid}`);
  }

  static async isPlayerInGame(gameId: string, uid: string): Promise<boolean> {
    const playerDataRef = this.getPlayerDataGameRef(gameId, uid);

    try {
      const snapshot = await get(playerDataRef);
      if (snapshot.exists()) {
        // handle the case where player changes their name locally
        LocalStorageManager.setPlayerName((snapshot.val() as PlayerData).name);
      }
      return snapshot.exists();
    } catch (error) {
      console.error("Error checking player in game: ", error);
      toast.error(UNKNOWN_ERROR_MESSAGE);
      return false;
    }
  }

  static async getGameStatus(gameId: string): Promise<GameStatus> {
    const publicDataRef = this.getPublicDataGameRef(gameId);
    try {
      const snapshot = await get(publicDataRef);
      if (snapshot.exists()) {
        const publicData = snapshot.val() as PublicGameData;
        return publicData.status;
      } else {
        return GameStatus.GAME_OVER;
      }
    } catch (error) {
      console.error("Error retrieving game status: ", error);
      toast.error(UNKNOWN_ERROR_MESSAGE);
      return GameStatus.GAME_OVER;
    }
  }

}
