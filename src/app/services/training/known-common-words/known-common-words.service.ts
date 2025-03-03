import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { CommonWordsService } from "../common-words/common-words.service";
import { ITrainingService } from "../training.service";
import { KnownWordsService } from "../known-words/known-words.service";

@Injectable({ providedIn: "root" })
export class KnownCommonWordsService implements ITrainingService {
	public availableWords: string[] = [];
	public wordsLoaded$ = new BehaviorSubject<boolean>(false);

	constructor (
		private readonly commonWordsService: CommonWordsService,
		private readonly knownWordsService: KnownWordsService
	) {
		this.knownWordsService.knownCounter$.subscribe(() => this.loadWords());
	}

	public async loadWords (): Promise<void> {
		this.availableWords = this.knownWordsService.availableWords.filter(word => this.commonWordsService.words.has(word));
		this.wordsLoaded$.next(true);
	}
}
