import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Component, effect, signal, ViewChild } from "@angular/core";

import { addIcons } from "ionicons";
import { checkmarkCircle, checkmarkCircleOutline, checkmarkDoneCircle, checkmarkDoneCircleOutline, closeCircleOutline, homeOutline, pauseCircleOutline, playCircleOutline, removeCircleOutline } from "ionicons/icons";
import { IonButton, IonButtons, IonContent, IonIcon, IonMenuButton, IonRouterLink, IonText, IonToolbar } from "@ionic/angular/standalone";

import { filter, take } from "rxjs";

import { environment } from "src/environments/environment";

import { SpellingInputComponent } from "src/app/components/spelling-input/spelling-input.component";

import { AllWordsService } from "src/app/services/training/all-words/all-words.service";
import { CommonWordsService } from "src/app/services/training/common-words/common-words.service";
import { DictionaryService } from "src/app/services/dictionary/dictionary.service";
import { ITrainingService } from "src/app/services/training/training.service";
import { KnownCommonWordsService } from "src/app/services/training/known-common-words/known-common-words.service";
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
		IonButton,
		IonButtons,
		IonContent,
		IonIcon,
		IonMenuButton,
		IonRouterLink,
		IonText,
		IonToolbar,
		CommonModule,
		FormsModule,
		SpellingInputComponent
	]
})
export class TrainPage {
	@ViewChild(SpellingInputComponent)
	protected spellingInput?: SpellingInputComponent;

	public expected = signal("");
	public spelledWord: string = "";
	public validate: boolean = false;

	public isPlaying: boolean = false;
	public partOfSpeech: string = "Unknown";
	public definition: string = "";
	public example: string = "";
	public context: string[] = [];
	public antonyms: string = "";
	public synonyms: string = "";
	public spellingCounter: number = 0;

	private audio: HTMLAudioElement;
	private trainingService: ITrainingService;

	constructor (
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly allWordsService: AllWordsService,
		private readonly commonWordsService: CommonWordsService,
		private readonly dictionaryService: DictionaryService,
		private readonly knownCommonWordsService: KnownCommonWordsService,
		private readonly knownWordsService: KnownWordsService,
		private readonly misspelledWordsService: MisspelledWordsService,
		private readonly wordsToReviewService: WordsToReviewService
	) {
		this.audio = new Audio();
		addIcons({ checkmarkCircle, checkmarkCircleOutline, checkmarkDoneCircle, checkmarkDoneCircleOutline, closeCircleOutline, homeOutline, pauseCircleOutline, playCircleOutline, removeCircleOutline });
		switch (this.route.snapshot.paramMap.get("word-list")) {
			case "common-words":
				this.trainingService = this.commonWordsService;
				break;
			case "known-common-words":
				this.trainingService = this.knownCommonWordsService;
				break;
			case "known-words":
				this.trainingService = this.knownWordsService;
				break;
			case "misspelled":
				this.trainingService = this.misspelledWordsService;
				break;
			case "reviewing":
				this.wordsToReviewService.loadWords();
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

		effect(() => {
			const meaning = this.dictionaryService.getMeaning(this.expected());
			const antonyms = this.dictionaryService.getAntonyms(this.expected());
			const synonyms = this.dictionaryService.getSynonyms(this.expected());
			const wordRegex = new RegExp(this.expected(), "gi");

			if (!meaning) {
				this.partOfSpeech = "Unknown";
				this.definition = "";
				this.example = "";
				this.context = [];
				this.antonyms = "";
				this.synonyms = "";
				return;
			}

			this.partOfSpeech = meaning[0] || "Unknown";
			this.definition = (meaning[1] || "").replace(wordRegex, "___");
			this.context = meaning[2].filter(c => !c.toUpperCase().includes(this.expected().toUpperCase()));

			const examples = meaning[3].filter(e => wordRegex.test(e));
			this.example = (examples[Math.floor(Math.random() * examples.length)] || "").replace(wordRegex, "___");

			if (antonyms)
				this.antonyms = antonyms.filter(a => a.toUpperCase() !== this.expected().toUpperCase()).join(", ").replace(wordRegex, "___");
			else
				this.antonyms = "";

			if (synonyms)
				this.synonyms = synonyms.filter(s => s.toUpperCase() !== this.expected().toUpperCase()).join(", ").replace(wordRegex, "___");
			else
				this.synonyms = "";
		});
	}

	public nextWord (): void {
		if (!this.trainingService.availableWords.length) {
			this.router.navigateByUrl("/dashboard", { replaceUrl: true });
			return;
		}

		this.validate = false;
		this.spelledWord = "";
		this.expected.set(this.trainingService.availableWords[Math.floor(Math.random() * this.trainingService.availableWords.length)]);

		if (this.trainingService === this.misspelledWordsService)
			this.spellingCounter = this.misspelledWordsService.getSpellingCounter(this.expected());
		else if (this.trainingService === this.wordsToReviewService)
			this.spellingCounter = this.wordsToReviewService.getSpellingCounter(this.expected());
		else
			this.spellingCounter = this.knownWordsService.getSpellingCounter(this.expected());

		this.audio.src = `${environment.audioURL}${this.expected().toLowerCase()}.mp3`;
		this.audio.muted = false;
		this.audio.autoplay = true;
		this.audio.play();
		this.audio.onplay = () => this.isPlaying = !this.audio?.paused;
		this.audio.onpause = () => this.isPlaying = !this.audio?.paused;
	}

	public validateWord (): void {
		if (this.validate)
			return this.nextWord();

		this.validate = true;

		if (this.expected() === this.spelledWord.toUpperCase()) {
			const removed = this.misspelledWordsService.remove(this.expected());
			if (removed) {
				if (this.knownWordsService.isKnown(this.expected()))
					this.knownWordsService.add(this.expected());
				else
					this.wordsToReviewService.add(this.expected());

				this.spellingCounter = this.knownWordsService.getSpellingCounter(this.expected()) || this.wordsToReviewService.getSpellingCounter(this.expected());
			} else {
				this.spellingCounter = this.misspelledWordsService.getSpellingCounter(this.expected());
			}
		} else {
			this.misspelledWordsService.add(this.expected());
			this.wordsToReviewService.remove(this.expected());
			this.knownWordsService.remove(this.expected());

			this.spellingCounter = this.misspelledWordsService.getSpellingCounter(this.expected());
		}
	}

	public play (): void {
		this.audio.play();
	}

	public pause (): void {
		this.audio.pause();
		this.audio.currentTime = 0;
	}
}
