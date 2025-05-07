
export const MIN_PLAYERS = 4;
export const MAX_PLAYERS = 12;

export const MAX_NAME_LENGTH = 10;
export const MAX_GAME_ID_LENGTH = 10;

export enum GameStatus {
    IN_LOBBY = 0,
    IN_PROGRESS = 1,
    GAME_OVER = 2,
}

export interface GameData {
    public: PublicGameData,
    private: {
        [key: string]: PlayerData;
    };
}

export interface PublicGameData {
    status: GameStatus;
    host: string;
    redTeam: [string];
    blueTeam: [string];
}

export interface PlayerData {
    name: string;
    uid: string;
    cards: [];
}
