import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { KnownWords } from "src/app/models/user";

import { DictionaryService } from "../../dictionary/dictionary.service";
import { ITrainingService } from "../training.service";

@Injectable({ providedIn: "root" })
export class AllWordsService implements ITrainingService {
	public availableWords: string[] = [];
	public wordsLoaded$ = new BehaviorSubject<boolean>(false);

	constructor (private readonly dictionaryService: DictionaryService) { }

	public loadWords (knownWords: KnownWords) {
		this.availableWords = [];
		for (const word of this.dictionaryService.words) {
			if (!(word in knownWords))
				this.availableWords.push(word);
		}

		this.wordsLoaded$.next(true);
	}

	public knownWordAdded (word: string): void {
		const index = this.availableWords.indexOf(word);
		if (index > -1)
			this.availableWords.splice(index, 1);
	}

	public knownWordRemoved (word: string): void {
		if (!this.availableWords.includes(word))
			this.availableWords.push(word);
	}
}
