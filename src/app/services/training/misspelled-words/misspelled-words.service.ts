import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { MisspelledWords } from "src/app/models/user";

import { AppStorageService } from "../../app-storage/app-storage.service";
import { ITrainingService } from "../training.service";

@Injectable({ providedIn: "root" })
export class MisspelledWordsService implements ITrainingService {
	private _counter$ = new BehaviorSubject<number>(0);

	public misspelledWords: MisspelledWords = {};
	public availableWords: string[] = [];
	public wordsLoaded$ = new BehaviorSubject<boolean>(false);

	constructor (private readonly appStorageService: AppStorageService) { }

	public get counter$ (): Observable<number> {
		return this._counter$.asObservable();
	}

	public async loadWords (): Promise<void> {
		this.misspelledWords = await this.appStorageService.getMisspelledWords();
		this.availableWords = Object.keys(this.misspelledWords);
		this._counter$.next(this.availableWords.length);
		this.wordsLoaded$.next(true);
	}

	public add (word: string): boolean {
		if (!this.misspelledWords[word])
			this.misspelledWords[word] = 0;

		this.misspelledWords[word]++;
		this.appStorageService.setMisspelledWords(this.misspelledWords);

		if (!this.availableWords.includes(word))
			this.availableWords.push(word);

		this._counter$.next(this.availableWords.length);
		return true;
	}

	public remove (word: string, force: boolean = false): boolean {
		const index = this.availableWords.indexOf(word);
		const counter = this.misspelledWords[word] || 1;

		if (!force && counter > 1) {
			if (index === -1)
				this.availableWords.push(word);

			this.misspelledWords[word] = counter - 1;
			this.appStorageService.setMisspelledWords(this.misspelledWords);
			return false;
		}

		if (index > -1) {
			this.availableWords.splice(index, 1);
			this._counter$.next(this.availableWords.length);
		}

		delete this.misspelledWords[word];
		this.appStorageService.setMisspelledWords(this.misspelledWords);
		return true;
	}

	public getSpellingCounter (word: string): number {
		return (this.misspelledWords[word] || 1) * -1;
	}
}
