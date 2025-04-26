import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { KnownWords, MisspelledWords, WordsToReview } from "src/app/models/user";

import { DictionaryService } from "../../dictionary/dictionary.service";
import { ITrainingService } from "../training.service";

@Injectable({ providedIn: "root" })
export class AllWordsService implements ITrainingService {
	private _counter$ = new BehaviorSubject<number>(0);

	public availableWords: string[] = [];
	public wordsLoaded$ = new BehaviorSubject<boolean>(false);

	constructor (private readonly dictionaryService: DictionaryService) { }

	public get counter$ (): Observable<number> {
		return this._counter$.asObservable();
	}

	public loadWords (knownWords: KnownWords, wordsToReview: WordsToReview, misspelledWords: MisspelledWords, ignoredWords: Set<string>) {
		this.availableWords = [];
		for (const word of this.dictionaryService.words) {
			if (!(word in knownWords) && !(word in wordsToReview) && !(word in misspelledWords) && !ignoredWords.has(word))
				this.availableWords.push(word);
		}

		this._counter$.next(this.availableWords.length);
		this.wordsLoaded$.next(true);
	}

	public consumeWord (word: string): void {
		const index = this.availableWords.indexOf(word);
		if (index > -1) {
			this.availableWords.splice(index, 1);
			this._counter$.next(this.availableWords.length);
		}
	}
}
