import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { AppStorageService } from "../../app-storage/app-storage.service";
import { AuthenticationService } from "../../authentication/authentication.service";
import { DictionaryService } from "../../dictionary/dictionary.service";
import { ITrainingService } from "../training.service";

@Injectable({ providedIn: "root" })
export class AllWordsService implements ITrainingService {
	public availableWords: string[] = [];
	public wordsLoaded$ = new BehaviorSubject<boolean>(false);

	constructor (
		private readonly appStorageService: AppStorageService,
		private readonly authenticationService: AuthenticationService,
		private readonly dictionaryService: DictionaryService
	) {
		// Refresh available words whenever the user logs in or out.
		this.authenticationService.user$.subscribe(() => this.loadWords());
	}

	public async loadWords (): Promise<void> {
		const knownWords = Object.keys(await this.appStorageService.getKnownWords());

		for (const word of this.dictionaryService.words) {
			if (!knownWords.includes(word))
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
