import { Injectable } from "@angular/core";

import { Platform } from "@ionic/angular";

import { saveAs } from "file-saver";

import { ISaveGame } from "src/app/models/save-game";

import { AppStorageService } from "../app-storage/app-storage.service";
import { AuthenticationService } from "../authentication/authentication.service";

@Injectable({ providedIn: "root" })
export class SaveGameService {
	constructor (
		private readonly platform: Platform,
		private readonly authenticationService: AuthenticationService,
		private readonly appStorageService: AppStorageService
	) { }

	public async saveGame (): Promise<void> {
		const saveGameData = await this.buildSaveGameData();
		console.log("Save game data:", saveGameData);

		if (this.platform.is("desktop")) {
			const blob = new Blob([JSON.stringify(saveGameData)], { type: "application/json;charset=utf-8" });
			saveAs(blob, `spelling-trainer-${saveGameData.user.name.replaceAll(" ", "-")}.json`);
		} else {
			// TODO
		}
	}

	public async loadSaveGame (): Promise<void> {
		if (this.platform.is("desktop")) {
			// TODO
		} else {
			// TODO
		}
	}

	private async buildSaveGameData (): Promise<ISaveGame> {
		if (!this.authenticationService.isLoggedIn)
			throw new Error("User not logged in");

		return {
			user: this.authenticationService.user!,
			knownWords: await this.appStorageService.getKnownWords(),
			misspelledWords: await this.appStorageService.getMisspelledWords(),
			wordsToReview: await this.appStorageService.getWordsToReview()
		};
	}

	private async loadSaveGameData (saveGameData: ISaveGame): Promise<void> {
		await this.appStorageService.setKnownWords(saveGameData.knownWords, saveGameData.user);
		await this.appStorageService.setMisspelledWords(saveGameData.misspelledWords, saveGameData.user);
		await this.appStorageService.setWordsToReview(saveGameData.wordsToReview, saveGameData.user);

		// Log-in using new user
		this.authenticationService.saveLoggedUser(saveGameData.user);
	}
}
