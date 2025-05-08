
import { toast } from 'react-toastify';
import { NavigateFunction } from 'react-router-dom';
import { BackendClient, BackendResponse } from '../../backend/BackendClient';
import { createGame, joinGame } from '../../backend/FirebaseUtils';
import { ClientData } from '../../model/ClientData';
import { MAX_GAME_ID_LENGTH, MAX_NAME_LENGTH } from '../../model/GameData';
import { Page } from '../PageRouter';
import { INVALID_INPUT_MESSAGE } from '../../utils/AlertMessages';
import { LocalStorageManager } from '../../utils/LocalStorageManager';

export class HomeService {

  static handleCreateGame(
    clientData: ClientData,
    navigate: NavigateFunction,
    setButtonsDisabled: (disabled: boolean) => void
  ) {

    if (!this.areInputsValid(clientData.playerName, clientData.gameId)) {
        toast.error(INVALID_INPUT_MESSAGE);
        return;
    };

    BackendClient.callEndpointAndHandleResponse(
      createGame,
      clientData,
      (response: BackendResponse) => {
        LocalStorageManager.setLocalData(clientData);
        navigate(Page.LOBBY);
      },
      setButtonsDisabled
    );
  }


  static handleJoinGame(
    clientData: ClientData,
    navigate: NavigateFunction,
    setButtonsDisabled: (disabled: boolean) => void
  ) {

    if (!this.areInputsValid(clientData.playerName, clientData.gameId)) {
        toast.error(INVALID_INPUT_MESSAGE);
        return;
    };

    BackendClient.callEndpointAndHandleResponse(
      joinGame,
      clientData,
      (response: BackendResponse) => {
        LocalStorageManager.setLocalData(clientData);
        navigate(Page.LOBBY);
      },
      setButtonsDisabled
    );
  }

  private static areInputsValid = (playerName: string, gameId: string) => {
    return playerName.length <= MAX_NAME_LENGTH && gameId.length <= MAX_GAME_ID_LENGTH;
  };
}
