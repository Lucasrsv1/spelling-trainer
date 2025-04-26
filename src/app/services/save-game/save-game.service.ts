import { Injectable } from "@angular/core";

// import { Platform } from "@ionic/angular";

import { saveAs } from "file-saver";

import { ISaveGame } from "src/app/models/save-game";

import { AppStorageService } from "../app-storage/app-storage.service";
import { AuthenticationService } from "../authentication/authentication.service";
import { DictionaryService } from "../dictionary/dictionary.service";
import { UtilsService } from "../utils/utils.service";

@Injectable({ providedIn: "root" })
export class SaveGameService {
	constructor (
		// private readonly platform: Platform,
		private readonly authenticationService: AuthenticationService,
		private readonly appStorageService: AppStorageService,
		private readonly dictionaryService: DictionaryService,
		private readonly utilsService: UtilsService
	) { }

	public async saveGame (): Promise<void> {
		const saveGameData = await this.buildSaveGameData();

		// if (this.platform.is("desktop")) {
		const blob = new Blob([JSON.stringify(saveGameData)], { type: "application/json;charset=utf-8" });
		saveAs(blob, `spelling-trainer-${saveGameData.user.name.replaceAll(" ", "-")}.json`);
		// } else {
		// 	// TODO
		// }
	}

	public async loadSaveGameFromFile (file: File): Promise<void> {
		if (file.size > 1024 * 1024 * 50) {
			await this.utilsService.alert("File is Too Large", "Please make sure the file is less than 50MB.");
			return;
		}

		if (file.type !== "application/json") {
			await this.utilsService.alert("Invalid File Type", "Please make sure the file is a JSON file.");
			return;
		}

		try {
			const saveGameData: ISaveGame = JSON.parse(await this.utilsService.readTextFile(file));

			if (
				saveGameData.user && saveGameData.knownWords && saveGameData.misspelledWords && saveGameData.wordsToReview && saveGameData.ignoredWords
				&& saveGameData.user.name && saveGameData.user.uuid && typeof saveGameData.user.name === "string" && typeof saveGameData.user.uuid === "string"
				&& typeof saveGameData.knownWords === "object" && typeof saveGameData.misspelledWords === "object" && typeof saveGameData.wordsToReview === "object"
				&& Array.isArray(saveGameData.ignoredWords)
			)
				await this.loadSaveGameData(saveGameData);
			else
				await this.utilsService.alert("Failed to Load Profile", "Please make sure the file is a valid spelling trainer profile.");
		} catch (error) {
			console.error("Failed to load save game:", error);
			await this.utilsService.alert("Failed to Load Profile", "Please make sure the file is a valid JSON file.");
		}
	}

	private async buildSaveGameData (): Promise<ISaveGame> {
		if (!this.authenticationService.isLoggedIn)
			throw new Error("User not logged in");

		return {
			user: this.authenticationService.user!,
			knownWords: await this.appStorageService.getKnownWords(),
			misspelledWords: await this.appStorageService.getMisspelledWords(),
			wordsToReview: await this.appStorageService.getWordsToReview(),
			ignoredWords: await this.appStorageService.getIgnoredWords()
		};
	}

	private async loadSaveGameData (saveGameData: ISaveGame): Promise<void> {
		const knownWordsCounter = Object.keys(saveGameData.knownWords).length;
		const progress = Math.floor(knownWordsCounter / this.dictionaryService.words.size * 1000) / 10;
		const confirm = await this.utilsService.prompt(
			"Load Profile",
			`Are you sure you want to load this profile?<br><br>${saveGameData.user.name}: ${knownWordsCounter} known words (${progress}%)`
		);

		if (!confirm)
			return;

		await this.appStorageService.setKnownWords(saveGameData.knownWords, saveGameData.user);
		await this.appStorageService.setMisspelledWords(saveGameData.misspelledWords, saveGameData.user);
		await this.appStorageService.setWordsToReview(saveGameData.wordsToReview, saveGameData.user);
		await this.appStorageService.setIgnoredWords(saveGameData.ignoredWords, saveGameData.user);
		await this.appStorageService.addUser(saveGameData.user);

		// Log-in using new user
		this.authenticationService.saveLoggedUser(saveGameData.user);
	}
}
