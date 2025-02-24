export interface IUser {
	name: string;
	uuid: string;
}

export interface IMisspelledWord {
	/**
	 * How many times the word has been misspelled.
	 */
	[word: string]: number;
}

export interface IWordToReview {
	/**
	 * The first number is how many times the word has been reviewed,
	 * and the second number is the date when the word will be available again for review.
	 */
	[word: string]: [number, number];
}
