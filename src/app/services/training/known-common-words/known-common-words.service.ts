import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { CommonWordsService } from "../common-words/common-words.service";
import { ITrainingService } from "../training.service";

@Injectable({ providedIn: "root" })
export class KnownCommonWordsService implements ITrainingService {
	private _counter$ = new BehaviorSubject<number>(0);

	public availableWords: string[] = [];
	public wordsLoaded$ = new BehaviorSubject<boolean>(false);

	constructor (private readonly commonWordsService: CommonWordsService) { }

	public get counter$ (): Observable<number> {
		return this._counter$.asObservable();
	}

	public async loadWords (knownWords: string[]): Promise<void> {
		this.availableWords = knownWords.filter(word => this.commonWordsService.words.has(word));
		this._counter$.next(this.availableWords.length);
		this.wordsLoaded$.next(true);
	}

	public knownWordAdded (word: string): void {
		if (!this.commonWordsService.words.has(word))
			return;

		if (!this.availableWords.includes(word)) {
			this.availableWords.push(word);
			this._counter$.next(this.availableWords.length);
		}
	}

	public knownWordRemoved (word: string): void {
		if (!this.commonWordsService.words.has(word))
			return;

		const index = this.availableWords.indexOf(word);
		if (index > -1) {
			this.availableWords.splice(index, 1);
			this._counter$.next(this.availableWords.length);
		}
	}
}
