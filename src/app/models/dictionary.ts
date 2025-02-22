/**
 * A meaning is an array containing the part of speech, a definition, an array of contexts, and an array of examples.
 */
export type IMeaning = [string, string, string[], string[]];

export interface IWord {
	MEANINGS: IMeaning[];
	ANTONYMS: string[];
	SYNONYMS: string[];
}

export interface ILinkedWord {
	LINK: string;
}

export interface IDictionary {
	[key: string]: IWord | ILinkedWord;
}
