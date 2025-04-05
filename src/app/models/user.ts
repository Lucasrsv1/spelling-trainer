export interface IUser {
	name: string;
	uuid: string;
}

export type KnownWords = {
	/**
	 * How many times the word has been properly spelled.
	 */
	[word: string]: number;
};

export type MisspelledWords = {
	/**
	 * How many times the word has been misspelled.
	 */
	[word: string]: number;
};

export type WordsToReview = {
	/**
	 * The first number is how many times the word has been reviewed,
	 * and the second number is the date when the word will be available again for review.
	 */
	[word: string]: [number, number];
};
