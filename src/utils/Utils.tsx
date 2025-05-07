
import { toast } from 'react-toastify';
import { BackendResponse } from '../model/BackendResponse';
import { UNKNOWN_ERROR_MESSAGE } from './AlertMessages';
import { GameData } from '../model/GameData';

export const handleBackendResponse = (response: BackendResponse) => {
    if (response.data.succeeded) {
        toast.success(response.data.message);
    } else {
        toast.error(response.data.message);
    }
}

export const handleUnknownError = (error: any) => {
    console.error("Error: ", error);
    toast.error(UNKNOWN_ERROR_MESSAGE);
}

export const isPlayerInGame = (gameData: GameData, playerName: string, uid: string) => {
    const players = gameData.private;
    const playerData = players[playerName];
    return playerData && playerData.uid === uid;
}
