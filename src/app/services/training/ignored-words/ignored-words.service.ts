import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { AppStorageService } from "../../app-storage/app-storage.service";

@Injectable({ providedIn: "root" })
export class IgnoredWordsService {
	public ignoredWords: Set<string> = new Set();
	public wordsLoaded$ = new BehaviorSubject<boolean>(false);

	constructor (private readonly appStorageService: AppStorageService) { }

	public async loadWords (): Promise<void> {
		this.ignoredWords = new Set(await this.appStorageService.getIgnoredWords());
		this.wordsLoaded$.next(true);
	}

	public add (word: string): void {
		if (!this.ignoredWords.has(word)) {
			this.ignoredWords.add(word);
			this.appStorageService.setIgnoredWords(Array.from(this.ignoredWords));
		}
	}

	public remove (word: string): void {
		if (this.ignoredWords.has(word)) {
			this.ignoredWords.delete(word);
			this.appStorageService.setIgnoredWords(Array.from(this.ignoredWords));
		}
	}
}
