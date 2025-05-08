import { ClientData } from "../model/ClientData";

export class LocalStorageManager {
    private static GAME_ID_KEY = 'gameId';
    private static PLAYER_NAME_KEY = 'playerName';
    private static UID_KEY = 'uid';

    static isLocalDataPresent(): boolean {
        return (
            localStorage.getItem(this.GAME_ID_KEY) !== null &&
            localStorage.getItem(this.PLAYER_NAME_KEY) !== null &&
            localStorage.getItem(this.UID_KEY) !== null
        );
    }

    static setLocalData(clientData: ClientData): void {
        localStorage.setItem(this.GAME_ID_KEY, clientData.gameId);
        localStorage.setItem(this.PLAYER_NAME_KEY, clientData.playerName);
        localStorage.setItem(this.UID_KEY, clientData.uid);
    }

    static setPlayerName(name: string): void {
        localStorage.setItem(this.PLAYER_NAME_KEY, name);
    }

    static getLocalData(): ClientData | null {
        const gameId = localStorage.getItem(this.GAME_ID_KEY);
        const playerName = localStorage.getItem(this.PLAYER_NAME_KEY);
        const uid = localStorage.getItem(this.UID_KEY);

        if (gameId && playerName && uid) {
            return { gameId, playerName, uid };
        }

        return null;
    }

    static clearLocalData(): void {
        localStorage.removeItem(this.GAME_ID_KEY);
        localStorage.removeItem(this.PLAYER_NAME_KEY);
        localStorage.removeItem(this.UID_KEY);
    }
}
