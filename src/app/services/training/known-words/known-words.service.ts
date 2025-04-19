import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { KnownWords } from "src/app/models/user";

import { AppStorageService } from "../../app-storage/app-storage.service";
import { ITrainingService } from "../training.service";

@Injectable({ providedIn: "root" })
export class KnownWordsService implements ITrainingService {
	private _counter$ = new BehaviorSubject<number>(0);

	public knownWords: KnownWords = {};
	public availableWords: string[] = [];
	public wordsLoaded$ = new BehaviorSubject<boolean>(false);

	constructor (private readonly appStorageService: AppStorageService) { }

	public get counter$ (): Observable<number> {
		return this._counter$.asObservable();
	}

	public async loadWords (): Promise<void> {
		this.knownWords = await this.appStorageService.getKnownWords();
		this.availableWords = Object.keys(this.knownWords);

		this._counter$.next(this.availableWords.length);
		this.wordsLoaded$.next(true);
	}

	public add (word: string): void {
		if (!this.knownWords[word])
			this.knownWords[word] = 3;

		this.knownWords[word]++;
		this.appStorageService.setKnownWords(this.knownWords);

		if (!this.availableWords.includes(word))
			this.availableWords.push(word);

		this._counter$.next(this.availableWords.length);
	}

	public remove (word: string): void {
		const index = this.availableWords.indexOf(word);
		if (index > -1) {
			this.availableWords.splice(index, 1);
			this._counter$.next(this.availableWords.length);
		}

		delete this.knownWords[word];
		this.appStorageService.setKnownWords(this.knownWords);
	}

	public getSpellingCounter (word: string): number {
		return this.knownWords[word] || 0;
	}

	public isKnown (word: string): boolean {
		return word in this.knownWords;
	}
}
