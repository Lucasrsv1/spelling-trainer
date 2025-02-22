import { Injectable } from "@angular/core";

import { IDictionary } from "../../models/dictionary";

import dictionary from "./dictionary.json";

@Injectable({ providedIn: "root" })
export class DictionaryService {
	public dictionary: IDictionary;
	public words: Set<string>;

	constructor () {
		this.words = new Set(Object.keys(dictionary));
		this.dictionary = (dictionary as unknown) as IDictionary;
	}
}
