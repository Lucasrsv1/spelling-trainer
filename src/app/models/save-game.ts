import { IUser, KnownWords, MisspelledWords, WordsToReview } from "./user";

export interface ISaveGame {
	user: IUser;
	knownWords: KnownWords;
	misspelledWords: MisspelledWords;
	wordsToReview: WordsToReview;
	ignoredWords: string[];
}
