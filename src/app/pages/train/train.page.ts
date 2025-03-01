import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Component, effect, signal, ViewChild } from "@angular/core";

import { addIcons } from "ionicons";
import { homeOutline, pauseCircleOutline, playCircleOutline } from "ionicons/icons";
import { IonButton, IonButtons, IonContent, IonIcon, IonMenuButton, IonRouterLink, IonText, IonToolbar } from "@ionic/angular/standalone";

import { filter, take } from "rxjs";

import { environment } from "src/environments/environment";

import { SpellingInputComponent } from "src/app/components/spelling-input/spelling-input.component";

import { AllWordsService } from "src/app/services/training/all-words/all-words.service";
import { CommonWordsService } from "src/app/services/training/common-words/common-words.service";
import { DictionaryService } from "src/app/services/dictionary/dictionary.service";
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

	public audio: HTMLAudioElement;
	public isPlaying: boolean = false;
	public partOfSpeech: string = "Unknown";
	public definition: string = "";
	public example: string = "";
	public context: string[] = [];
	public antonyms: string = "";
	public synonyms: string = "";

	private trainingService: ITrainingService;

	constructor (
		private readonly route: ActivatedRoute,
		private readonly allWordsService: AllWordsService,
		private readonly commonWordsService: CommonWordsService,
		private readonly dictionaryService: DictionaryService,
		private readonly knownWordsService: KnownWordsService,
		private readonly misspelledWordsService: MisspelledWordsService,
		private readonly wordsToReviewService: WordsToReviewService
	) {
		this.audio = new Audio();
		addIcons({ homeOutline, pauseCircleOutline, playCircleOutline });
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
				this.antonyms = antonyms.filter(a => !a.toUpperCase().includes(this.expected().toUpperCase())).join(", ");
			else
				this.antonyms = "";

			if (synonyms)
				this.synonyms = synonyms.filter(s => !s.toUpperCase().includes(this.expected().toUpperCase())).join(", ");
			else
				this.synonyms = "";
		});
	}

	public nextWord (): void {
		this.validate = false;
		this.spelledWord = "";
		this.expected.set(this.trainingService.availableWords[Math.floor(Math.random() * this.trainingService.availableWords.length)]);
		console.log(this.expected(), this.spelledWord);
		// this.spelledWord = "dichlorodiphenyltrichloroethane";

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
		console.log(this.expected(), "===", this.spelledWord, this.expected() === this.spelledWord.toUpperCase());

		if (this.expected() === this.spelledWord.toUpperCase()) {
			this.misspelledWordsService.remove(this.expected());
			this.wordsToReviewService.add(this.expected());
		} else {
			this.misspelledWordsService.add(this.expected());
			this.wordsToReviewService.remove(this.expected());
			this.knownWordsService.remove(this.expected());
		}
	}
}
