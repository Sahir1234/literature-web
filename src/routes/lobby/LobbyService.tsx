
import { onValue } from "firebase/database";
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BackendClient, BackendResponse } from '../../backend/BackendClient';
import { DatabaseClient } from '../../backend/DatabaseClient';
import { leaveLobby, startGame } from '../../backend/FirebaseUtils';
import { ClientData } from '../../model/ClientData';
import { GAME_ROUTE, HOME_ROUTE, PageRouter } from '../PageRouter';
import { LocalStorageManager } from '../../utils/LocalStorageManager';
import { MAX_PLAYERS, MIN_PLAYERS, PublicGameData } from '../../model/GameData';
import { NEED_EVEN_TEAMS_MESSAGE, WRONG_AMOUNT_OF_PLAYERS_MESSAGE } from "../../utils/AlertMessages";

export class LobbyService {

    static onComponentChange(
        navigate: NavigateFunction,
        setPlayerName: (playerName: string) => void,
        setGameId: (gameId: string) => void,
        setHost: (host: string) => void,
        setRedTeam: (redTeam: string[]) => void,
        setBlackTeam: (blackTeam: string[]) => void
    ) {
        PageRouter.rerouteBasedOnGameStatus(navigate);

        const {gameId, playerName, uid } = LocalStorageManager.getLocalData() as ClientData;
        setPlayerName(playerName);
        setGameId(gameId);

        const publicGameDataRef = DatabaseClient.getPublicDataGameRef(gameId);
        const unsubscribe = onValue(publicGameDataRef, (snapshot) => { 
            this.updateLobbyState(snapshot, navigate, setHost, setRedTeam, setBlackTeam); 
        });
        return () => unsubscribe();
    }

    
    static updateLobbyState(
        snapshot: any, 
        navigate: NavigateFunction, 
        setHost: (host: string) => void,
        setRedTeam: (redTeam: string[]) => void,
        setBlackTeam: (blackTeam: string[]) => void
    ) {
        if (snapshot.exists()) {
            const publicGameData = snapshot.val() as PublicGameData;

            // navigate away based on status if the game has started
            navigate((publicGameData.status));

            setHost(publicGameData.host);
            setRedTeam(publicGameData.redTeam ? publicGameData.redTeam : []);
            setBlackTeam(publicGameData.blackTeam ? publicGameData.blackTeam : []);
        } else {
            LocalStorageManager.clearLocalData();
            navigate(HOME_ROUTE);
        }
    }


  static handleSwitchTeams(
    navigate: NavigateFunction,
    setButtonsDisabled: (disabled: boolean) => void
  ) {
    this.returnHomeIfLocalDataIsEmpty(navigate);

    const clientData: ClientData = LocalStorageManager.getLocalData()!;

    BackendClient.callEndpointAndHandleResponse(
      leaveLobby,
      clientData,
      (response: BackendResponse) => { },
      setButtonsDisabled
    );
  }


  static handleLeaveLobby(
    navigate: NavigateFunction,
    setButtonsDisabled: (disabled: boolean) => void
  ) {
    this.returnHomeIfLocalDataIsEmpty(navigate);

    const clientData: ClientData = LocalStorageManager.getLocalData()!;

    BackendClient.callEndpointAndHandleResponse(
      leaveLobby,
      clientData,
      (response: BackendResponse) => {
        LocalStorageManager.clearLocalData();
        navigate(HOME_ROUTE);
      },
      setButtonsDisabled
    );
  }


  static handleStartGame(
    redTeam: string[],
    blackTeam: string[],
    navigate: NavigateFunction,
    setButtonsDisabled: (disabled: boolean) => void
  ) {

    if (redTeam.length !== blackTeam.length) {
        toast.error(NEED_EVEN_TEAMS_MESSAGE);
        return;
    } else if (((redTeam.length + blackTeam.length) < MIN_PLAYERS) || 
               ((redTeam.length + blackTeam.length) > MAX_PLAYERS)) {
        toast.error(WRONG_AMOUNT_OF_PLAYERS_MESSAGE);
        return;
    }

    this.returnHomeIfLocalDataIsEmpty(navigate);

    const clientData: ClientData = LocalStorageManager.getLocalData()!;

    BackendClient.callEndpointAndHandleResponse(
      startGame,
      clientData,
      (response: BackendResponse) => {
        navigate(GAME_ROUTE);
      },
      setButtonsDisabled
    );
  }

  private static returnHomeIfLocalDataIsEmpty(navigate: NavigateFunction) {
    if (!LocalStorageManager.isLocalDataPresent()) {
        // clear local data as a sanity check
        LocalStorageManager.clearLocalData();
        navigate(HOME_ROUTE);
    }
  }
}
