import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { CommonWordsService } from "../common-words/common-words.service";
import { ITrainingService } from "../training.service";

@Injectable({ providedIn: "root" })
export class KnownCommonWordsService implements ITrainingService {
	public availableWords: string[] = [];
	public wordsLoaded$ = new BehaviorSubject<boolean>(false);

	constructor (private readonly commonWordsService: CommonWordsService) { }

	public async loadWords (knownWords: string[]): Promise<void> {
		this.availableWords = knownWords.filter(word => this.commonWordsService.words.has(word));
		this.wordsLoaded$.next(true);
	}

	public knownWordAdded (word: string): void {
		if (!this.commonWordsService.words.has(word))
			return;

		if (!this.availableWords.includes(word))
			this.availableWords.push(word);
	}

	public knownWordRemoved (word: string): void {
		if (!this.commonWordsService.words.has(word))
			return;

		const index = this.availableWords.indexOf(word);
		if (index > -1)
			this.availableWords.splice(index, 1);
	}
}
