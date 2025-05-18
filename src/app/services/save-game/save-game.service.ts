import { Injectable } from "@angular/core";

import { AlertController } from "@ionic/angular";

import { Share } from "@capacitor/share";
import { Capacitor, CapacitorException } from "@capacitor/core";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";

import { saveAs } from "file-saver-es";

import { ISaveGame } from "src/app/models/save-game";

import { AppStorageService } from "../app-storage/app-storage.service";
import { AuthenticationService } from "../authentication/authentication.service";
import { DictionaryService } from "../dictionary/dictionary.service";
import { UtilsService } from "../utils/utils.service";

@Injectable({ providedIn: "root" })
export class SaveGameService {
	constructor (
		private readonly alertController: AlertController,
		private readonly authenticationService: AuthenticationService,
		private readonly appStorageService: AppStorageService,
		private readonly dictionaryService: DictionaryService,
		private readonly utilsService: UtilsService
	) { }

	public async saveGame (): Promise<void> {
		try {
			const saveGameData = await this.buildSaveGameData();
			const fileName = `spelling-trainer-${saveGameData.user.name.replaceAll(" ", "-")}.json`;
			const content = JSON.stringify(saveGameData);

			if (Capacitor.isNativePlatform()) {
				const answer = await this.promptShareOrSave();

				if (answer === "SHARE") {
					const file = await Filesystem.writeFile({
						path: fileName,
						data: content,
						directory: Directory.Cache,
						encoding: Encoding.UTF8
					});

					await Share.share({
						url: file.uri,
						dialogTitle: "Export My Progress"
					});
				} else if (answer === "SAVE") {
					await Filesystem.writeFile({
						path: fileName,
						data: content,
						directory: Directory.Documents,
						encoding: Encoding.UTF8
					});

					this.utilsService.toast("File saved to documents folder", "success");
				}
			} else {
				const blob = new Blob([content], { type: "application/json;charset=utf-8" });
				saveAs(blob, fileName);
			}
		} catch (error) {
			if (error instanceof CapacitorException && error.message === "Share canceled")
				return;

			console.error("Failed to save game:", error);
			this.utilsService.toast("An error occurred while saving your progress", "danger", 5000);
		}
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

		this.loadSaveGame(await this.utilsService.readTextFile(file));
	}

	public async loadSaveGame (jsonString: string): Promise<void> {
		try {
			const saveGameData: ISaveGame = JSON.parse(jsonString);

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

	private promptShareOrSave (): Promise<"SHARE" | "SAVE" | null> {
		return new Promise(resolve => {
			this.alertController
				.create({
					header: "Export Progress",
					message: "How would you like to export your progress?",
					backdropDismiss: true,
					buttons: [{
						text: "Share File",
						handler: () => resolve("SHARE")
					}, {
						text: "Save Local File",
						handler: () => resolve("SAVE")
					}]
				})
				.then(alert => {
					alert.present();
					alert.onDidDismiss().then(
						() => resolve(null)
					);
				});
		});
	}
}
