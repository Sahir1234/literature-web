
export enum GameStatus {
    IN_LOBBY = 0,
    IN_PROGRESS = 1,
    GAME_OVER = 2,
}

export interface GameData {
    status: GameStatus;
    players: {
        [key: string]: {
            name: string;
            uid: string;
            team: boolean;
        };
    };

}