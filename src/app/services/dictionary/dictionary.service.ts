import { Injectable } from "@angular/core";

import { IDictionary, IMeaning } from "../../models/dictionary";

import dictionary from "./dictionary.json";

@Injectable({ providedIn: "root" })
export class DictionaryService {
	public dictionary: IDictionary;
	public words: Set<string>;

	constructor () {
		this.words = new Set(Object.keys(dictionary));
		this.dictionary = (dictionary as unknown) as IDictionary;
	}

	public getMeaning (word: string): IMeaning | null {
		if (!this.dictionary[word])
			return null;

		if ("LINK" in this.dictionary[word])
			return this.getMeaning(this.dictionary[word].LINK);

		const complete = this.dictionary[word].MEANINGS.find(m => m[1] && m[2].length && m[3].length);
		if (complete)
			return complete;

		const withDefinitionAndExample = this.dictionary[word].MEANINGS.find(m => m[1] && m[3].length);
		if (withDefinitionAndExample)
			return withDefinitionAndExample;

		const withDefinitionAndContext = this.dictionary[word].MEANINGS.find(m => m[1] && m[2].length);
		if (withDefinitionAndContext)
			return withDefinitionAndContext;

		const withDefinition = this.dictionary[word].MEANINGS.find(m => m[1]);
		if (withDefinition)
			return withDefinition;

		return this.dictionary[word].MEANINGS[0] || null;
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
}
