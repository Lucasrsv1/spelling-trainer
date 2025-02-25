import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";

import { addIcons } from "ionicons";
import { homeOutline } from "ionicons/icons";
import { IonButton, IonButtons, IonContent, IonIcon, IonMenuButton, IonRouterLink, IonToolbar } from "@ionic/angular/standalone";

import { filter, take } from "rxjs";

import { SpellingInputComponent } from "src/app/components/spelling-input/spelling-input.component";

import { AllWordsService } from "src/app/services/training/all-words/all-words.service";
import { CommonWordsService } from "src/app/services/training/common-words/common-words.service";
import { ITrainingService } from "src/app/services/training/training.service";
import { KnownWordsService } from "src/app/services/training/known-words/known-words.service";
import { MisspelledWordsService } from "src/app/services/training/misspelled-words/misspelled-words.service";
import { WordsToReviewService } from "src/app/services/training/words-to-review/words-to-review.service";

@Component({
	selector: "app-train",
	templateUrl: "./train.page.html",
	styleUrls: ["./train.page.scss"],
	standalone: true,
	imports: [
		RouterLink,
		IonIcon,
		IonButton,
		IonButtons,
		IonContent,
		IonMenuButton,
		IonToolbar,
		IonRouterLink,
		CommonModule,
		FormsModule,
		SpellingInputComponent
	]
})
export class TrainPage {
	public spelledWord: string = "";
	public expected: string = "";
	public validate: boolean = false;

	private trainingService: ITrainingService;

	constructor (
		private readonly route: ActivatedRoute,
		private readonly allWordsService: AllWordsService,
		private readonly commonWordsService: CommonWordsService,
		private readonly knownWordsService: KnownWordsService,
		private readonly misspelledWordsService: MisspelledWordsService,
		private readonly wordsToReviewService: WordsToReviewService
	) {
		addIcons({ homeOutline });
		switch (this.route.snapshot.paramMap.get("word-list")) {
			case "common-words":
				this.trainingService = this.commonWordsService;
				break;
			case "known-words":
				this.trainingService = this.knownWordsService;
				break;
			case "misspelled":
				this.trainingService = this.misspelledWordsService;
				break;
			case "reviewing":
				this.trainingService = this.wordsToReviewService;
				break;
			case "all-words":
			default:
				this.trainingService = this.allWordsService;
				break;
		}

		this.trainingService.wordsLoaded$
			.pipe(filter(loaded => loaded), take(1))
			.subscribe(() => this.nextWord());
	}

	public nextWord (): void {
		this.validate = false;
		this.spelledWord = "";
		this.expected = this.trainingService.availableWords[Math.floor(Math.random() * this.trainingService.availableWords.length)];
		console.log(this.expected, this.spelledWord);
		// this.spelledWord = "dichlorodiphenyltrichloroethane";
	}

	public validateWord (): void {
		if (this.validate)
			return this.nextWord();

		this.validate = true;
		console.log(this.expected, "===", this.spelledWord, this.expected === this.spelledWord.toUpperCase());

		if (this.expected === this.spelledWord.toUpperCase()) {
			this.misspelledWordsService.remove(this.expected);
			this.wordsToReviewService.add(this.expected);
		} else {
			this.misspelledWordsService.add(this.expected);
			this.wordsToReviewService.remove(this.expected);
			this.knownWordsService.remove(this.expected);
		}
	}
}
