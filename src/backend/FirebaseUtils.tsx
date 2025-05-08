
import { getDatabase } from "firebase/database";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { app } from "../../firebase";

export const functions = getFunctions(app);

// Enable emulator for local development
connectFunctionsEmulator(functions, "localhost", 5001);

export const rtdb = getDatabase(app);

export const createGame = httpsCallable(functions, 'createGame');
export const joinGame = httpsCallable(functions, 'joinGame');

export const leaveLobby = httpsCallable(functions, 'leaveLobby');
export const switchTeams = httpsCallable(functions, 'switchTeams');
export const startGame = httpsCallable(functions, 'startGame');
