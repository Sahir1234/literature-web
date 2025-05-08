
import { NavigateFunction } from 'react-router-dom';
import { DatabaseClient } from '../backend/DatabaseClient';
import { ClientData } from '../model/ClientData';
import { GameStatus } from '../model/GameData';
import { LocalStorageManager } from '../utils/LocalStorageManager';

export const HOME_ROUTE = '/';
export const LOBBY_ROUTE = '/lobby';
export const GAME_ROUTE = '/game';

export class PageRouter {

  static rerouteBasedOnGameStatus(navigate: NavigateFunction) {
    const localData = LocalStorageManager.getLocalData() as ClientData;

    if (!LocalStorageManager.isLocalDataPresent() ||
        !DatabaseClient.isPlayerInGame(localData.gameId, localData.playerName, localData.uid)) {
        LocalStorageManager.clearLocalData();
        navigate(HOME_ROUTE);
    } else {
        const gameStatus = DatabaseClient.getGameStatus(localData.gameId);
        navigate(this.getPageRouteForStatus(gameStatus));
    }
  }

  static getPageRouteForStatus(gameStatus: GameStatus) {
    switch (gameStatus) {
      case GameStatus.IN_LOBBY:
        return LOBBY_ROUTE;
      case GameStatus.IN_PROGRESS:
        return GAME_ROUTE;
      default:
        LocalStorageManager.clearLocalData();
        return HOME_ROUTE;
    }
  };
}
