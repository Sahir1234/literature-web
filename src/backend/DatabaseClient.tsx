
import { toast } from 'react-toastify';
import { get, ref } from "firebase/database";
import { GameStatus, PlayerData, PublicGameData } from '../model/GameData';
import { rtdb } from "./FirebaseUtils";
import { UNKNOWN_ERROR_MESSAGE } from '../utils/AlertMessages';

export class DatabaseClient {

  static getPublicDataGameRef(gameId: string) {
    return ref(rtdb, `GAMES/${gameId}/public}`);
  }

  static getPlayerDataGameRef(gameId: string, playerName: string) {
    return ref(rtdb, `GAMES/${gameId}/private/${playerName}`);
  }

  static isPlayerInGame(gameId: string, playerName: string, uid: string): boolean {
    const playerDataRef = this.getPlayerDataGameRef(gameId, playerName);

    get(playerDataRef).then((snapshot) => {
      if (snapshot.exists()) { 
        const playerData = snapshot.val() as PlayerData;
        if (playerData.uid === uid) { 
          return true; 
        }
      }
    }).catch((error) => {
      console.error("Error: ", error);
      toast.error(UNKNOWN_ERROR_MESSAGE);
    });

    return false;
}

  static getGameStatus(gameId: string): GameStatus {
    const publicDataRef = this.getPublicDataGameRef(gameId);
  
    get(publicDataRef).then((snapshot) => {
      if (snapshot.exists()) {
        const publicData = snapshot.val() as PublicGameData;
        return publicData.status;
      }
    }).catch((error) => {
      console.error("Error retrieving game status: ", error);
      toast.error(UNKNOWN_ERROR_MESSAGE);
    });
  
    return GameStatus.GAME_OVER;
  }
}
