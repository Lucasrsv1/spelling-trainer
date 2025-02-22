import { Injectable } from "@angular/core";

import { DictionaryService } from "../../dictionary/dictionary.service";
import { ITrainingService } from "../training.service";

import commonWords from "./common-words.json";

@Injectable({ providedIn: "root" })
export class CommonWordsService implements ITrainingService {
	public words: Set<string>;

	constructor (private readonly dictionaryService: DictionaryService) {
		this.words = new Set<string>();
		for (const word of commonWords.map(w => w.toUpperCase())) {
			if (this.dictionaryService.words.has(word))
				this.words.add(word);
		}
	}
}
