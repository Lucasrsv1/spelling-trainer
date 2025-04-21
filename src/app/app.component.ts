import { AsyncPipe, NgIf } from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

import { addIcons } from "ionicons";
import { Platform } from "@ionic/angular";
import { bookOutline, checkmarkDoneOutline, checkmarkOutline, closeCircleOutline, homeOutline, informationCircleOutline, logOutOutline, saveOutline, searchOutline, textOutline, trashOutline } from "ionicons/icons";
import { IonApp, IonAvatar, IonBadge, IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote, IonRouterLink, IonRouterOutlet, IonSplitPane, IonText } from "@ionic/angular/standalone";

import { StatusBar } from "@capacitor/status-bar";

import { register } from "swiper/element/bundle";
import { RoundProgressModule } from "angular-svg-round-progressbar";

import { Observable, Subscription } from "rxjs";

import { environment } from "src/environments/environment";
import { IUser } from "./models/user";
import { Progress } from "./models/progress";

import { AppStorageService } from "./services/app-storage/app-storage.service";
import { AuthenticationService } from "./services/authentication/authentication.service";
import { CommonWordsService } from "./services/training/common-words/common-words.service";
import { DictionaryService } from "./services/dictionary/dictionary.service";
import { SaveGameService } from "./services/save-game/save-game.service";
import { TrainerLoaderService } from "./services/training/trainer-loader/trainer-loader.service";
import { UtilsService } from "./services/utils/utils.service";

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
		IonNote,
		IonItem,
		IonIcon,
		IonLabel,
		IonRouterLink,
		IonRouterOutlet,
		IonText,
		RoundProgressModule
	]
})
export class AppComponent implements OnDestroy {
	private subscriptions: Subscription[] = [];

	public user$: Observable<IUser | null>;
	public isLoggedIn$: Observable<boolean>;
	public progress = new Progress();

	public appVersion: string = environment.version;

	constructor (
		public readonly dictionaryService: DictionaryService,
		public readonly commonWordsService: CommonWordsService,
		public readonly saveGameService: SaveGameService,
		private readonly platform: Platform,
		private readonly appStorageService: AppStorageService,
		private readonly authenticationService: AuthenticationService,
		private readonly trainerLoaderService: TrainerLoaderService,
		private readonly utilsService: UtilsService
	) {
		if (this.platform.is("mobile") || this.platform.is("mobileweb"))
			StatusBar.setBackgroundColor({ color: "#333333" });

		addIcons({ bookOutline, checkmarkDoneOutline, checkmarkOutline, closeCircleOutline, homeOutline, informationCircleOutline, logOutOutline, saveOutline, searchOutline, textOutline, trashOutline });

		this.user$ = this.authenticationService.user$;
		this.isLoggedIn$ = this.authenticationService.isLoggedIn$;

		this.subscriptions.push(
			this.trainerLoaderService.progress$.subscribe(progress => this.progress = progress)
		);
	}

	public get userInitials (): string {
		const names: string[] = (this.authenticationService.user?.name || "").split(" ");
		if (!names.length)
			return "";

		if (names.length === 1)
			return names[0][0].toUpperCase();

		return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
	}

	public ngOnDestroy (): void {
		for (const subscription of this.subscriptions)
			subscription.unsubscribe();
	}

	public logout (): void {
		this.authenticationService.signOut();
	}

	public async deleteProfile (): Promise<void> {
		if (!this.authenticationService.isLoggedIn || !this.authenticationService.user)
			return;

		const confirm = await this.utilsService.prompt("Delete Profile", "Are you sure you want to delete your profile and all associated data?", "Cancel", true);
		if (!confirm)
			return;

		await this.appStorageService.deleteUser(this.authenticationService.user);
		this.authenticationService.signOut();
	}
}
