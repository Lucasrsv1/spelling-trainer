import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, OnDestroy, signal, ViewChild } from "@angular/core";

import { addIcons } from "ionicons";
import { IonicSlides } from "@ionic/angular";
import { checkmarkCircle, checkmarkCircleOutline, checkmarkDoneCircle, checkmarkDoneCircleOutline, closeCircleOutline, eyeOffOutline, homeOutline, pauseCircleOutline, playCircleOutline, removeCircleOutline } from "ionicons/icons";
import { IonButton, IonButtons, IonContent, IonIcon, IonMenuButton, IonRouterLink, IonText, IonToolbar } from "@ionic/angular/standalone";

import { filter, Subscription, take } from "rxjs";

import { environment } from "src/environments/environment";
import { IFormattedMeaning } from "src/app/models/dictionary";

import { MobileKeyboardComponent } from "src/app/components/mobile-keyboard/mobile-keyboard.component";
import { SpellingInputComponent } from "src/app/components/spelling-input/spelling-input.component";

import { AllWordsService } from "src/app/services/training/all-words/all-words.service";
import { CommonWordsService } from "src/app/services/training/common-words/common-words.service";
import { DictionaryService } from "src/app/services/dictionary/dictionary.service";
import { ITrainingService } from "src/app/services/training/training.service";
import { KnownCommonWordsService } from "src/app/services/training/known-common-words/known-common-words.service";
import { KnownWordsService } from "src/app/services/training/known-words/known-words.service";
import { MisspelledWordsService } from "src/app/services/training/misspelled-words/misspelled-words.service";
import { TrainerLoaderService } from "src/app/services/training/trainer-loader/trainer-loader.service";
import { WordsToReviewService } from "src/app/services/training/words-to-review/words-to-review.service";

@Component({
	selector: "app-train",
	templateUrl: "./train.page.html",
	styleUrls: ["./train.page.scss"],
	standalone: true,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
		SpellingInputComponent,
		MobileKeyboardComponent
	]
})
export class TrainPage implements OnDestroy {
	@ViewChild(SpellingInputComponent)
	protected spellingInput?: SpellingInputComponent;

	@ViewChild("swiper")
	protected swiperRef?: ElementRef;

	protected swiperModules = [IonicSlides];

	public expected = signal("");
	public spelledWord: string = "";
	public validate: boolean = false;
	public gotItRight: boolean = false;

	public isPlaying: boolean = false;
	public meanings: IFormattedMeaning[] = [];
	public antonyms: string = "";
	public synonyms: string = "";
	public spellingCounter: number = 0;

	private audio: HTMLAudioElement;
	private trainingService: ITrainingService;
	private subscriptions: Subscription[] = [];

	constructor (
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly allWordsService: AllWordsService,
		private readonly commonWordsService: CommonWordsService,
		private readonly dictionaryService: DictionaryService,
		private readonly knownCommonWordsService: KnownCommonWordsService,
		private readonly knownWordsService: KnownWordsService,
		private readonly misspelledWordsService: MisspelledWordsService,
		private readonly trainerLoaderService: TrainerLoaderService,
		private readonly wordsToReviewService: WordsToReviewService
	) {
		this.audio = new Audio();
		addIcons({ checkmarkCircle, checkmarkCircleOutline, checkmarkDoneCircle, checkmarkDoneCircleOutline, closeCircleOutline, eyeOffOutline, homeOutline, pauseCircleOutline, playCircleOutline, removeCircleOutline });
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

		this.subscriptions.push(
			this.trainingService.wordsLoaded$
				.pipe(filter(loaded => loaded), take(1))
				.subscribe(() => this.nextWord())
		);

		effect(() => {
			this.meanings = this.dictionaryService.getMeanings(this.expected());
			this.swiperRef?.nativeElement.swiper.slideTo(0);

			const wordRegex = new RegExp(this.expected(), "gi");
			const antonyms = this.dictionaryService.getAntonyms(this.expected());
			const synonyms = this.dictionaryService.getSynonyms(this.expected());

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

	public ngOnDestroy (): void {
		for (const subscription of this.subscriptions)
			subscription.unsubscribe();
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
		this.gotItRight = this.expected() === this.spelledWord.toUpperCase();

		if (this.gotItRight) {
			const removed = this.trainerLoaderService.removeMisspelledWord(this.expected());
			if (removed) {
				if (!this.knownWordsService.isKnown(this.expected()))
					this.trainerLoaderService.addWordToReview(this.expected());
				else
					this.trainerLoaderService.addKnownWord(this.expected());

				this.spellingCounter = this.knownWordsService.getSpellingCounter(this.expected()) || this.wordsToReviewService.getSpellingCounter(this.expected());
			} else {
				this.spellingCounter = this.misspelledWordsService.getSpellingCounter(this.expected());
			}
		} else {
			this.trainerLoaderService.addMisspelledWord(this.expected());

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

	public nextMeaning (): void {
		this.swiperRef?.nativeElement.swiper.slideNext();
	}

	public previousMeaning (): void {
		this.swiperRef?.nativeElement.swiper.slidePrev();
	}

	public ignoreWord (): void {
		this.trainerLoaderService.ignoreWord(this.expected());
		this.nextWord();
	}
}
