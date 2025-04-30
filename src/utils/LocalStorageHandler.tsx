
export const isLocalStorageDataPresent = () => {
    const gameId = localStorage.getItem('gameId');
    const playerName = localStorage.getItem('playerName');
    const uid = localStorage.getItem('uid');

    return gameId !== null && playerName !== null && uid !== null;
}

export const setLocalStorageData = (gameId: string, playerName: string, uid: string) => {
    localStorage.setItem('gameId', gameId);
    localStorage.setItem('playerName', playerName);
    localStorage.setItem('uid', uid);
};

export const getLocalStorageGameId = () => {
    return localStorage.getItem('gameId');
}

export const getLocalStoragePlayerName = () => {
    return localStorage.getItem('playerName');
}

export const getLocalStorageUid = () => {
    return localStorage.getItem('uid');
}

export const getLocalStorageData = () => {
    const gameId = localStorage.getItem('gameId');
    const playerName = localStorage.getItem('playerName');
    const uid = localStorage.getItem('uid');

    return { gameId, playerName, uid };
}

export const clearLocalStorageData = () => {
    localStorage.removeItem('gameId');
    localStorage.removeItem('playerName');
    localStorage.removeItem('uid');
};
