import { Injectable } from "@angular/core";

import dayjs from "dayjs";
import { BehaviorSubject, Observable } from "rxjs";

import { WordsToReview } from "src/app/models/user";

import { AppStorageService } from "../../app-storage/app-storage.service";
import { ITrainingService } from "../training.service";

export interface INextReview {
	counter: number;
	days: number;
}

@Injectable({ providedIn: "root" })
export class WordsToReviewService implements ITrainingService {
	private _counter$ = new BehaviorSubject<number>(0);
	private _nextReview$ = new BehaviorSubject<INextReview>({ counter: 0, days: 0 });

	public wordsToReview: WordsToReview = {};
	public availableWords: string[] = [];
	public notAvailableWords: string[] = [];
	public wordsLoaded$ = new BehaviorSubject<boolean>(false);

	constructor (private readonly appStorageService: AppStorageService) { }

	public get counter$ (): Observable<number> {
		return this._counter$.asObservable();
	}

	public get nextReview$ (): Observable<INextReview> {
		return this._nextReview$.asObservable();
	}

	public async loadWords (): Promise<void> {
		const startOfDay = dayjs().startOf("day").unix();
		this.wordsToReview = await this.appStorageService.getWordsToReview();

		this.availableWords = [];
		this.notAvailableWords = [];
		for (const word of Object.keys(this.wordsToReview)) {
			if (this.wordsToReview[word][1] <= startOfDay)
				this.availableWords.push(word);
			else
				this.notAvailableWords.push(word);
		}

		this.updateCounters();
		this.wordsLoaded$.next(true);
	}

	public add (word: string): boolean {
		if (!this.notAvailableWords.includes(word))
			this.notAvailableWords.push(word);

		const index = this.availableWords.indexOf(word);
		if (index > -1)
			this.availableWords.splice(index, 1);

		if (!this.wordsToReview[word]) {
			// Schedule first review in 2 days.
			this.wordsToReview[word] = [0, dayjs().add(2, "day").startOf("day").unix()];
			this.appStorageService.setWordsToReview(this.wordsToReview);
			this.updateCounters();
		} else if (this.wordsToReview[word][0] < 2) {
			// Schedule second review in 3 days, and third review in 5 days.
			const daysUntilNextReview = this.wordsToReview[word][0] === 0 ? 3 : 5;
			this.wordsToReview[word][0]++;
			this.wordsToReview[word][1] = dayjs().add(daysUntilNextReview, "day").startOf("day").unix();
			this.appStorageService.setWordsToReview(this.wordsToReview);
			this.updateCounters();
		} else {
			// After the third review, remove the word from words to review and return false signaling that the word must be added to known words.
			this.remove(word);
			return false;
		}

		return true;
	}

	public remove (word: string): void {
		const indexAvailable = this.availableWords.indexOf(word);
		if (indexAvailable > -1)
			this.availableWords.splice(indexAvailable, 1);

		const indexNotAvailable = this.notAvailableWords.indexOf(word);
		if (indexNotAvailable > -1)
			this.notAvailableWords.splice(indexNotAvailable, 1);

		delete this.wordsToReview[word];
		this.appStorageService.setWordsToReview(this.wordsToReview);
		this.updateCounters();
	}

	public getSpellingCounter (word: string): number {
		return (this.wordsToReview[word] ? this.wordsToReview[word][0] : 0) + 1;
	}

	private updateCounters (): void {
		this._counter$.next(this.availableWords.length);

		const nextAvailableDate = Math.min(...this.notAvailableWords.map(word => this.wordsToReview[word][1]));
		const nextAvailableWords = this.notAvailableWords.filter(word => this.wordsToReview[word][1] === nextAvailableDate);

		this._nextReview$.next({
			counter: nextAvailableWords.length,
			days: Math.ceil((nextAvailableDate - dayjs().unix()) / (24 * 60 * 60))
		});
	}
}
