import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AsyncPipe, NgIf } from "@angular/common";

import { RoundProgressModule } from "angular-svg-round-progressbar";

import { IonBadge, IonButton, IonButtons, IonContent, IonLabel, IonMenuButton, IonNote, IonRouterLink, IonText, IonToolbar } from "@ionic/angular/standalone";

import { CommonWordsService } from "src/app/services/training/common-words/common-words.service";
import { DictionaryService } from "src/app/services/dictionary/dictionary.service";
import { KnownWordsService } from "src/app/services/training/known-words/known-words.service";
import { MisspelledWordsService } from "src/app/services/training/misspelled-words/misspelled-words.service";
import { INextReview, WordsToReviewService } from "src/app/services/training/words-to-review/words-to-review.service";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.page.html",
	styleUrls: ["./dashboard.page.scss"],
	standalone: true,
	imports: [
		AsyncPipe,
		IonNote,
		IonButtons,
		IonToolbar,
		IonButton,
		IonBadge,
		IonMenuButton,
		IonLabel,
		IonRouterLink,
		IonText,
		IonContent,
		NgIf,
		FormsModule,
		RouterLink,
		RoundProgressModule
	]
})
export class DashboardPage {
	public nextReview?: INextReview;
	public commonCounter = { value: 0, percentage: 0 };
	public knownCounter = { value: 0, percentage: 0 };

	constructor (
		public readonly dictionaryService: DictionaryService,
		public readonly commonWordsService: CommonWordsService,
		public readonly knownWordsService: KnownWordsService,
		public readonly misspelledWordsService: MisspelledWordsService,
		public readonly wordsToReviewService: WordsToReviewService
	) {
		this.commonWordsService.commonCounter$.subscribe(counter => {
			this.commonCounter.value = counter;
			this.commonCounter.percentage = Math.round(counter / this.commonWordsService.words.size * 100);
		});

		this.knownWordsService.knownCounter$.subscribe(counter => {
			this.knownCounter.value = counter;
			this.knownCounter.percentage = Math.round(counter / this.dictionaryService.words.size * 100);
		});

		this.wordsToReviewService.nextReview$.subscribe(review => this.nextReview = review);
	}
}
