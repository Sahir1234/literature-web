
import { NavigateFunction } from 'react-router-dom';
import { DatabaseClient } from '../backend/DatabaseClient';
import { ClientData } from '../model/ClientData';
import { GameStatus } from '../model/GameData';
import { LocalStorageManager } from '../utils/LocalStorageManager';

export enum Page {
  HOME = '/',
  LOBBY = '/lobby',
  GAME = '/game'
}

export class PageRouter {

  static async rerouteBasedOnGameStatus(navigate: NavigateFunction, currPage: Page) {

    if (!LocalStorageManager.isLocalDataPresent()) {
      LocalStorageManager.clearLocalData();
      if (currPage !== Page.HOME) {
        navigate(Page.HOME);
      }
      return;
    }

    const localData = LocalStorageManager.getLocalData() as ClientData;
    const isPlayerinGame = await DatabaseClient.isPlayerInGame(localData.gameId, localData.uid)

    if (!isPlayerinGame) {
        LocalStorageManager.clearLocalData();
        if (currPage !== Page.HOME) {
          navigate(Page.HOME);
        }

    } else {
        const gameStatus = await DatabaseClient.getGameStatus(localData.gameId);
        const newPageRoute = this.getPageRouteForStatus(gameStatus);
        if (newPageRoute == Page.HOME) {
          LocalStorageManager.clearLocalData();
        }
        if (newPageRoute !== currPage) {
          navigate(newPageRoute);
        }
    }
  }

  public static getPageRouteForStatus(gameStatus: GameStatus): Page {
    switch (gameStatus) {
      case GameStatus.IN_LOBBY:
        return Page.LOBBY;
      case GameStatus.IN_PROGRESS:
        return Page.GAME;
      default:
        return Page.HOME;
    }
  };
}
