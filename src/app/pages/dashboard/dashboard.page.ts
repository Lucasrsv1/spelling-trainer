import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Component, OnDestroy } from "@angular/core";

import { RoundProgressModule } from "angular-svg-round-progressbar";

import { IonBadge, IonButton, IonButtons, IonContent, IonLabel, IonMenuButton, IonNote, IonRefresher, IonRefresherContent, IonRouterLink, IonText, IonToolbar } from "@ionic/angular/standalone";
import { IonRefresherCustomEvent, RefresherEventDetail } from "@ionic/core";

import { Subscription } from "rxjs";

import { Progress } from "src/app/models/progress";

import { CommonWordsService } from "src/app/services/training/common-words/common-words.service";
import { DictionaryService } from "src/app/services/dictionary/dictionary.service";
import { TrainerLoaderService } from "src/app/services/training/trainer-loader/trainer-loader.service";
import { INextReview, WordsToReviewService } from "src/app/services/training/words-to-review/words-to-review.service";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.page.html",
	styleUrls: ["./dashboard.page.scss"],
	standalone: true,
	imports: [
		IonNote,
		IonButtons,
		IonToolbar,
		IonButton,
		IonBadge,
		IonMenuButton,
		IonLabel,
		IonRefresherContent,
		IonRefresher,
		IonRouterLink,
		IonText,
		IonContent,
		NgIf,
		FormsModule,
		RouterLink,
		RoundProgressModule
	]
})
export class DashboardPage implements OnDestroy {
	private subscriptions: Subscription[] = [];

	public nextReview?: INextReview;
	public progress = new Progress();

	constructor (
		public readonly dictionaryService: DictionaryService,
		public readonly commonWordsService: CommonWordsService,
		private readonly trainerLoaderService: TrainerLoaderService,
		private readonly wordsToReviewService: WordsToReviewService
	) {
		this.subscriptions.push(
			this.trainerLoaderService.progress$.subscribe(progress => this.progress = progress),
			this.wordsToReviewService.nextReview$.subscribe(review => this.nextReview = review)
		);
	}

	public ionViewWillEnter (): void {
		this.wordsToReviewService.loadWords();
	}

	public async refresh (event: IonRefresherCustomEvent<RefresherEventDetail>): Promise<void> {
		await this.wordsToReviewService.loadWords();
		(event.target as HTMLIonRefresherElement).complete();
	}

	public ngOnDestroy (): void {
		for (const subscription of this.subscriptions)
			subscription.unsubscribe();
	}
}
