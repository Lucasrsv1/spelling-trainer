import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { addIcons } from "ionicons";
import { arrowBackOutline, checkmarkOutline, closeOutline, folderOpenOutline, personAddOutline } from "ionicons/icons";
import { IonButton, IonButtons, IonContent, IonIcon, IonLabel, IonNote, IonRouterLink, IonText, IonToolbar } from "@ionic/angular/standalone";

import { RoundProgressModule } from "angular-svg-round-progressbar";
import { v4 } from "uuid";

import { MobileKeyboardComponent } from "src/app/components/mobile-keyboard/mobile-keyboard.component";
import { SpellingInputComponent } from "src/app/components/spelling-input/spelling-input.component";

import { IUser } from "src/app/models/user";

import { AppStorageService } from "src/app/services/app-storage/app-storage.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { DictionaryService } from "src/app/services/dictionary/dictionary.service";
import { SaveGameService } from "src/app/services/save-game/save-game.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.page.html",
	styleUrls: ["./login.page.scss"],
	standalone: true,
	imports: [
		IonIcon,
		IonNote,
		IonLabel,
		IonButton,
		IonButtons,
		IonText,
		IonToolbar,
		IonContent,
		IonRouterLink,
		CommonModule,
		FormsModule,
		RoundProgressModule,
		RouterLink,
		SpellingInputComponent,
		MobileKeyboardComponent
	]
})
export class LoginPage implements OnInit {
	public users: IUser[] = [];
	public progress: Record<string, { value: number; percentage: number; } | undefined> = {};
	public name: string = "";
	public signUp: boolean = false;

	constructor (
		public readonly dictionaryService: DictionaryService,
		private readonly appStorageService: AppStorageService,
		private readonly authenticationService: AuthenticationService,
		private readonly saveGameService: SaveGameService
	) {
		addIcons({ arrowBackOutline, checkmarkOutline, closeOutline, folderOpenOutline, personAddOutline });
	}

	public ngOnInit (): void {
		this.loadProfiles();
	}

	public async loadProfiles (): Promise<void> {
		this.users = await this.appStorageService.getUsers();
		this.users.sort((a, b) => a.name.localeCompare(b.name));

		for (const user of this.users) {
			const knownWordsCounter = Object.keys(await this.appStorageService.getKnownWords(user)).length;
			this.progress[user.uuid] = {
				value: knownWordsCounter,
				percentage: Math.floor(knownWordsCounter / this.dictionaryService.words.size * 1000) / 10
			};
		}
	}

	public login (user: IUser): void {
		this.authenticationService.saveLoggedUser(user);
	}

	public openFile (): void {
		const input = document.getElementById("file-input") as HTMLInputElement | null;
		if (!input)
			return;

		input.value = "";
		input.click();
	}

	public loadProfile (event: Event): void {
		const fileList = (event.target as HTMLInputElement | null)?.files;
		if (!fileList || !fileList[0])
			return;

		this.saveGameService.loadSaveGameFromFile(fileList[0]);
	}

	public enterSignUp (): void {
		this.name = "";
		this.signUp = true;
	}

	public focus (): void {
		if (this.signUp)
			document.getElementById("keyboard-binding")?.focus();
	}

	public async createProfile (): Promise<void> {
		if (!this.name)
			return;

		const user: IUser = {
			name: this.name,
			uuid: v4()
		};

		await this.appStorageService.addUser(user);
		this.authenticationService.saveLoggedUser(user);
	}
}
