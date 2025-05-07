import { Injectable, OnDestroy } from "@angular/core";

import { BehaviorSubject, debounceTime, Subscription } from "rxjs";

import { Progress } from "src/app/models/progress";

import { AllWordsService } from "../all-words/all-words.service";
import { AuthenticationService } from "../../authentication/authentication.service";
import { CommonWordsService } from "../common-words/common-words.service";
import { DictionaryService } from "../../dictionary/dictionary.service";
import { IgnoredWordsService } from "../ignored-words/ignored-words.service";
import { KnownCommonWordsService } from "../known-common-words/known-common-words.service";
import { KnownWordsService } from "../known-words/known-words.service";
import { MisspelledWordsService } from "../misspelled-words/misspelled-words.service";
import { WordsToReviewService } from "../words-to-review/words-to-review.service";

@Injectable({ providedIn: "root" })
export class TrainerLoaderService implements OnDestroy {
	private progress = new Progress();
	private subscriptions: Subscription[] = [];

	public progress$ = new BehaviorSubject<Progress>(this.progress);

	constructor (
		private readonly allWordsService: AllWordsService,
		private readonly authenticationService: AuthenticationService,
		private readonly dictionaryService: DictionaryService,
		private readonly commonWordsService: CommonWordsService,
		private readonly ignoredWordsService: IgnoredWordsService,
		private readonly knownCommonWordsService: KnownCommonWordsService,
		private readonly knownWordsService: KnownWordsService,
		private readonly misspelledWordsService: MisspelledWordsService,
		private readonly wordsToReviewService: WordsToReviewService
	) {
		this.subscriptions.push(
			// Refresh available words whenever the user logs in or out.
			this.authenticationService.user$
				.pipe(debounceTime(100))
				.subscribe(() => this.loadWords()),

			this.allWordsService.counter$.subscribe(counter => {
				this.progress.all = counter;
				this.progress$.next(this.progress);
			}),

			this.commonWordsService.counter$.subscribe(counter => {
				this.progress.common = counter;
				this.progress$.next(this.progress);
			}),

			this.wordsToReviewService.counter$.subscribe(counter => {
				this.progress.inReview = counter;
				this.progress$.next(this.progress);
			}),

			this.misspelledWordsService.counter$.subscribe(counter => {
				this.progress.misspelled = counter;
				this.progress$.next(this.progress);
			}),

			this.knownCommonWordsService.counter$.subscribe(counter => {
				this.progress.known.common.value = counter;
				this.progress.known.common.progress = Math.floor(counter / this.commonWordsService.words.size * 1000) / 10;
				this.progress$.next(this.progress);
			}),

			this.knownWordsService.counter$.subscribe(counter => {
				this.progress.known.all.value = counter;
				this.progress.known.all.progress = Math.floor(counter / this.dictionaryService.words.size * 1000) / 10;
				this.progress$.next(this.progress);
			})
		);
	}

	public ngOnDestroy (): void {
		for (const subscription of this.subscriptions)
			subscription.unsubscribe();
	}

	public async loadWords (): Promise<void> {
		await this.knownWordsService.loadWords();
		await this.misspelledWordsService.loadWords();
		await this.wordsToReviewService.loadWords();
		await this.ignoredWordsService.loadWords();

		this.knownCommonWordsService.loadWords(this.knownWordsService.availableWords);

		this.allWordsService.loadWords(
			this.knownWordsService.knownWords,
			this.wordsToReviewService.wordsToReview,
			this.misspelledWordsService.misspelledWords,
			this.ignoredWordsService.ignoredWords
		);

		this.commonWordsService.loadWords(
			this.knownWordsService.knownWords,
			this.wordsToReviewService.wordsToReview,
			this.misspelledWordsService.misspelledWords,
			this.ignoredWordsService.ignoredWords
		);
	}

	public addKnownWord (word: string): void {
		this.knownWordsService.add(word);

		this.allWordsService.consumeWord(word);
		this.commonWordsService.consumeWord(word);
		this.knownCommonWordsService.knownWordAdded(word);
	}

	public removeKnownWord (word: string): void {
		this.knownWordsService.remove(word);
		this.knownCommonWordsService.knownWordRemoved(word);
	}

	public addMisspelledWord (word: string): void {
		this.misspelledWordsService.add(word);

		this.removeWordToReview(word);
		this.removeKnownWord(word);

		this.allWordsService.consumeWord(word);
		this.commonWordsService.consumeWord(word);
	}

	public removeMisspelledWord (word: string): boolean {
		return this.misspelledWordsService.remove(word);
	}

	public addWordToReview (word: string): void {
		if (this.wordsToReviewService.add(word)) {
			this.allWordsService.consumeWord(word);
			this.commonWordsService.consumeWord(word);
		} else {
			this.addKnownWord(word);
		}
	}

	public removeWordToReview (word: string): void {
		this.wordsToReviewService.remove(word);
	}

	public ignoreWord (word: string): void {
		this.misspelledWordsService.remove(word, true);
		this.ignoredWordsService.add(word);
	}

	public restoreWord (word: string): void {
		this.ignoredWordsService.remove(word);
		this.addMisspelledWord(word);
	}
}
