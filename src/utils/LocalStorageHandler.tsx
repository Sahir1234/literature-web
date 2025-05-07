import { ClientData } from "../model/ClientData";

export const isLocalStorageDataPresent = () => {
    const gameId = localStorage.getItem('gameId');
    const playerName = localStorage.getItem('playerName');
    const uid = localStorage.getItem('uid');

    return gameId !== null && playerName !== null && uid !== null;
}

export const setLocalStorageData = (clientData: ClientData) => {
    localStorage.setItem('gameId', clientData.gameId);
    localStorage.setItem('playerName', clientData.playerName);
    localStorage.setItem('uid', clientData.uid);
};

export const getLocalStorageData = () => {
    return {
        gameId: localStorage.getItem('gameId'),
        playerName: localStorage.getItem('playerName'),
        uid: localStorage.getItem('uid')
    }
}

export const clearLocalStorageData = () => {
    localStorage.removeItem('gameId');
    localStorage.removeItem('playerName');
    localStorage.removeItem('uid');
};
