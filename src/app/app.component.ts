import { Component } from "@angular/core";
import { AsyncPipe, NgIf } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";

import { addIcons } from "ionicons";
import { Platform } from "@ionic/angular";
import { bookOutline, checkmarkDoneOutline, checkmarkOutline, closeCircleOutline, homeOutline, logOutOutline, saveOutline, searchOutline, textOutline } from "ionicons/icons";
import { IonApp, IonAvatar, IonBadge, IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonRouterLink, IonRouterOutlet, IonSplitPane, IonText } from "@ionic/angular/standalone";

import { StatusBar } from "@capacitor/status-bar";

import { Observable } from "rxjs";
import { register } from "swiper/element/bundle";
import { RoundProgressModule } from "angular-svg-round-progressbar";

import { IUser } from "./models/user";

import { AuthenticationService } from "./services/authentication/authentication.service";
import { CommonWordsService } from "./services/training/common-words/common-words.service";
import { DictionaryService } from "./services/dictionary/dictionary.service";
import { KnownWordsService } from "./services/training/known-words/known-words.service";
import { MisspelledWordsService } from "./services/training/misspelled-words/misspelled-words.service";
import { SaveGameService } from "./services/save-game/save-game.service";
import { WordsToReviewService } from "./services/training/words-to-review/words-to-review.service";

register();

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.component.scss"],
	imports: [
		AsyncPipe,
		NgIf,
		RouterLink,
		RouterLinkActive,
		IonApp,
		IonAvatar,
		IonBadge,
		IonButton,
		IonSplitPane,
		IonMenu,
		IonContent,
		IonList,
		IonListHeader,
		IonMenuToggle,
		IonItem,
		IonIcon,
		IonLabel,
		IonRouterLink,
		IonRouterOutlet,
		IonText,
		RoundProgressModule
	]
})
export class AppComponent {
	public user$: Observable<IUser | null>;
	public isLoggedIn$: Observable<boolean>;
	public commonCounter = { value: 0, percentage: 0 };
	public knownCounter = { value: 0, percentage: 0 };

	constructor (
		public readonly dictionaryService: DictionaryService,
		public readonly commonWordsService: CommonWordsService,
		public readonly knownWordsService: KnownWordsService,
		public readonly misspelledWordsService: MisspelledWordsService,
		public readonly saveGameService: SaveGameService,
		public readonly wordsToReviewService: WordsToReviewService,
		private readonly platform: Platform,
		private readonly authenticationService: AuthenticationService
	) {
		if (this.platform.is("mobile") || this.platform.is("mobileweb"))
			StatusBar.setBackgroundColor({ color: "#333333" });

		addIcons({ bookOutline, checkmarkDoneOutline, checkmarkOutline, closeCircleOutline, homeOutline, logOutOutline, saveOutline, searchOutline, textOutline });

		this.user$ = this.authenticationService.user$;
		this.isLoggedIn$ = this.authenticationService.isLoggedIn$;

		this.commonWordsService.commonCounter$.subscribe(counter => {
			this.commonCounter.value = counter;
			this.commonCounter.percentage = Math.round(counter / this.commonWordsService.words.size * 100);
		});

		this.knownWordsService.knownCounter$.subscribe(counter => {
			this.knownCounter.value = counter;
			this.knownCounter.percentage = Math.round(counter / this.dictionaryService.words.size * 100);
		});
	}

	public get userInitials (): string {
		const names: string[] = (this.authenticationService.user?.name || "").split(" ");
		if (!names.length)
			return "";

		if (names.length === 1)
			return names[0][0].toUpperCase();

		return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
	}

	public logout (): void {
		this.authenticationService.signOut();
	}
}
