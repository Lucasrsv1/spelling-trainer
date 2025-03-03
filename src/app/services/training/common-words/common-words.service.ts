import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { AppStorageService } from "../../app-storage/app-storage.service";
import { DictionaryService } from "../../dictionary/dictionary.service";
import { ITrainingService } from "../training.service";

import commonWords from "./common-words.json";

@Injectable({ providedIn: "root" })
export class CommonWordsService implements ITrainingService {
	private _commonCounter$ = new BehaviorSubject<number>(0);

	public words: Set<string>;
	public availableWords: string[] = [];
	public wordsLoaded$ = new BehaviorSubject<boolean>(false);

	constructor (
		private readonly appStorageService: AppStorageService,
		private readonly dictionaryService: DictionaryService
	) {
		this.words = new Set<string>();

		for (const word of commonWords.map(w => w.toUpperCase())) {
			if (this.dictionaryService.words.has(word))
				this.words.add(word);
		}

		this.loadWords();
	}

	public get commonCounter$ (): Observable<number> {
		return this._commonCounter$.asObservable();
	}

	public async loadWords (): Promise<void> {
		let knownCommonWords = 0;
		const knownWords = Object.keys(await this.appStorageService.getKnownWords());

		for (const word of this.words) {
			if (knownWords.includes(word))
				knownCommonWords++;
			else
				this.availableWords.push(word);
		}

		this._commonCounter$.next(knownCommonWords);
		this.wordsLoaded$.next(true);
	}

	public knownWordAdded (word: string): void {
		if (!this.words.has(word))
			return;

		const index = this.availableWords.indexOf(word);
		if (index !== -1) {
			this.availableWords.splice(index, 1);
			this._commonCounter$.next(this._commonCounter$.value + 1);
		}
	}

	public knownWordRemoved (word: string): void {
		if (!this.words.has(word))
			return;

		if (!this.availableWords.includes(word)) {
			this.availableWords.push(word);
			this._commonCounter$.next(this._commonCounter$.value - 1);
		}
	}
}
