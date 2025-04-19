import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { KnownWords, MisspelledWords, WordsToReview } from "src/app/models/user";

import { DictionaryService } from "../../dictionary/dictionary.service";
import { ITrainingService } from "../training.service";

import commonWords from "./common-words.json";

@Injectable({ providedIn: "root" })
export class CommonWordsService implements ITrainingService {
	private _counter$ = new BehaviorSubject<number>(0);

	public words: Set<string>;
	public availableWords: string[] = [];
	public wordsLoaded$ = new BehaviorSubject<boolean>(false);

	constructor (private readonly dictionaryService: DictionaryService) {
		this.words = new Set<string>();

		for (const word of commonWords.map(w => w.toUpperCase())) {
			if (this.dictionaryService.words.has(word))
				this.words.add(word);
		}
	}

	public get counter$ (): Observable<number> {
		return this._counter$.asObservable();
	}

	public loadWords (knownWords: KnownWords, wordsToReview: WordsToReview, misspelledWords: MisspelledWords): void {
		this.availableWords = [];
		for (const word of this.words) {
			if (!(word in knownWords) && !(word in wordsToReview) && !(word in misspelledWords))
				this.availableWords.push(word);
		}

		this._counter$.next(this.availableWords.length);
		this.wordsLoaded$.next(true);
	}

	public consumeWord (word: string): void {
		if (!this.words.has(word))
			return;

		const index = this.availableWords.indexOf(word);
		if (index !== -1) {
			this.availableWords.splice(index, 1);
			this._counter$.next(this.availableWords.length);
		}
	}
}
