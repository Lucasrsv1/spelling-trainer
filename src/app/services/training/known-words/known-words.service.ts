import { Injectable } from "@angular/core";

import { BehaviorSubject, debounceTime, Observable } from "rxjs";

import { KnownWords } from "src/app/models/user";

import { AllWordsService } from "../all-words/all-words.service";
import { AppStorageService } from "../../app-storage/app-storage.service";
import { AuthenticationService } from "../../authentication/authentication.service";
import { CommonWordsService } from "../common-words/common-words.service";
import { ITrainingService } from "../training.service";
import { KnownCommonWordsService } from "../known-common-words/known-common-words.service";

@Injectable({ providedIn: "root" })
export class KnownWordsService implements ITrainingService {
	private _knownCounter$ = new BehaviorSubject<number>(0);
	public wordsLoaded$ = new BehaviorSubject<boolean>(false);

	private knownWords: KnownWords = {};

	/**
	 * The available words are the known words
	 */
	public availableWords: string[] = [];

	constructor (
		private readonly appStorageService: AppStorageService,
		private readonly authenticationService: AuthenticationService,
		private readonly allWordsService: AllWordsService,
		private readonly commonWordsService: CommonWordsService,
		private readonly knownCommonWordsService: KnownCommonWordsService
	) {
		// Refresh available words whenever the user logs in or out.
		this.authenticationService.user$
			.pipe(debounceTime(100))
			.subscribe(() => this.loadWords());
	}

	public get knownCounter$ (): Observable<number> {
		return this._knownCounter$.asObservable();
	}

	public async loadWords (): Promise<void> {
		this.knownWords = await this.appStorageService.getKnownWords();
		this.availableWords = Object.keys(this.knownWords);

		this._knownCounter$.next(this.availableWords.length);
		this.wordsLoaded$.next(true);

		this.allWordsService.loadWords(this.knownWords);
		this.commonWordsService.loadWords(this.knownWords);
		this.knownCommonWordsService.loadWords(this.availableWords);
	}

	public add (word: string): void {
		if (!this.knownWords[word])
			this.knownWords[word] = 3;

		this.knownWords[word]++;
		this.appStorageService.setKnownWords(this.knownWords);

		if (!this.availableWords.includes(word))
			this.availableWords.push(word);

		this._knownCounter$.next(this.availableWords.length);

		this.allWordsService.knownWordAdded(word);
		this.commonWordsService.knownWordAdded(word);
		this.knownCommonWordsService.knownWordAdded(word);
	}

	public remove (word: string): void {
		const index = this.availableWords.indexOf(word);
		if (index > -1) {
			this.availableWords.splice(index, 1);
			this._knownCounter$.next(this.availableWords.length);
		}

		delete this.knownWords[word];
		this.appStorageService.setKnownWords(this.knownWords);

		this.allWordsService.knownWordRemoved(word);
		this.commonWordsService.knownWordRemoved(word);
		this.knownCommonWordsService.knownWordRemoved(word);
	}

	public getSpellingCounter (word: string): number {
		return this.knownWords[word] || 0;
	}

	public isKnown (word: string): boolean {
		return word in this.knownWords;
	}
}
