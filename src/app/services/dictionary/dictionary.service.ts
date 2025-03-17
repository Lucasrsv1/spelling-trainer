import { Injectable } from "@angular/core";

import { IDictionary, IFormattedMeaning } from "../../models/dictionary";

import dictionary from "./dictionary.json";

@Injectable({ providedIn: "root" })
export class DictionaryService {
	public dictionary: IDictionary;
	public words: Set<string>;

	constructor () {
		this.words = new Set(Object.keys(dictionary));
		this.dictionary = (dictionary as unknown) as IDictionary;
	}

	public getMeanings (word: string): IFormattedMeaning[] {
		if (!this.dictionary[word]) {
			return [{
				partOfSpeech: "Unknown",
				definition: "",
				example: "",
				context: ""
			}];
		}

		if ("LINK" in this.dictionary[word])
			return this.getMeanings(this.dictionary[word].LINK);

		const wordRegex = new RegExp(word, "gi");
		const meanings = this.dictionary[word].MEANINGS.map(meaning => {
			const formattedMeaning: IFormattedMeaning = {
				partOfSpeech: meaning[0] || "Unknown",
				definition: (meaning[1] || "").replace(wordRegex, "___"),
				context: meaning[2].filter(c => !c.toUpperCase().includes(word.toUpperCase())).join(", "),
				example: ""
			};

			const examples = meaning[3].filter(e => wordRegex.test(e));
			formattedMeaning.example = (examples[Math.floor(Math.random() * examples.length)] || "").replace(wordRegex, "___");

			return formattedMeaning;
		});

		return meanings.sort((a, b) => this.getMeaningPriority(b) - this.getMeaningPriority(a));
	}

	public getAntonyms (word: string): string[] | null {
		if (!this.dictionary[word])
			return null;

		if ("LINK" in this.dictionary[word])
			return this.getAntonyms(this.dictionary[word].LINK);

		return this.dictionary[word].ANTONYMS;
	}

	public getSynonyms (word: string): string[] | null {
		if (!this.dictionary[word])
			return null;

		if ("LINK" in this.dictionary[word])
			return this.getSynonyms(this.dictionary[word].LINK);

		return this.dictionary[word].SYNONYMS;
	}

	private getMeaningPriority (meaning: IFormattedMeaning): number {
		let score = meaning.partOfSpeech ? 1 : 0;

		if (meaning.context)
			score += 1;

		if (meaning.example)
			score += 3;

		if (meaning.definition)
			score += 5;

		return score;
	}
}
