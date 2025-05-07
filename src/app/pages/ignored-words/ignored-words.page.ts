import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Component, OnDestroy } from "@angular/core";

import { addIcons } from "ionicons";
import { arrowUndoOutline, homeOutline } from "ionicons/icons";
import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonToolbar } from "@ionic/angular/standalone";

import { IgnoredWordsService } from "src/app/services/training/ignored-words/ignored-words.service";
import { Subscription } from "rxjs";
import { TrainerLoaderService } from "src/app/services/training/trainer-loader/trainer-loader.service";

@Component({
	selector: "app-ignored-words",
	templateUrl: "./ignored-words.page.html",
	styleUrls: ["./ignored-words.page.scss"],
	standalone: true,
	imports: [
		IonLabel,
		IonItem,
		IonButton,
		IonButtons,
		IonContent,
		IonIcon,
		IonList,
		IonMenuButton,
		IonToolbar,
		CommonModule,
		FormsModule,
		RouterLink
	]
})
export class IgnoredWordsPage implements OnDestroy {
	private subscription: Subscription;

	public ignoredWords: string[] = [];

	constructor (
		private readonly ignoredWordsService: IgnoredWordsService,
		private readonly trainerLoaderService: TrainerLoaderService
	) {
		addIcons({ homeOutline, arrowUndoOutline });

		this.subscription = this.ignoredWordsService.wordsLoaded$.subscribe(
			() => this.ignoredWords = Array.from(this.ignoredWordsService.ignoredWords).sort()
		);
	}

	public ngOnDestroy (): void {
		this.subscription.unsubscribe();
	}

	public restoreWord (word: string): void {
		this.trainerLoaderService.restoreWord(word);
		this.ignoredWords = this.ignoredWords.filter(w => w !== word);
	}
}
