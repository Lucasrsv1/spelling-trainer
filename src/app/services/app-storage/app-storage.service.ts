import { Injectable } from "@angular/core";

import { Storage } from "@ionic/storage-angular";

import { KnownWord, MisspelledWord, WordToReview } from "src/app/models/user";

import { AuthenticationService } from "../authentication/authentication.service";

const APP_USER_KW_KEY = "USER_KW_";
const APP_USER_MW_KEY = "USER_MW_";
const APP_USER_RW_KEY = "USER_RW_";

@Injectable({ providedIn: "root" })
export class AppStorageService {
	private storage?: Storage;

	constructor (
		private readonly storageLib: Storage,
		private readonly authenticationService: AuthenticationService
	) { }

	public get knownWordsKey (): string {
		return APP_USER_KW_KEY + (this.authenticationService.user?.uuid || "");
	}

	public get misspelledWordsKey (): string {
		return APP_USER_MW_KEY + (this.authenticationService.user?.uuid || "");
	}

	public get reviewingWordsKey (): string {
		return APP_USER_RW_KEY + (this.authenticationService.user?.uuid || "");
	}

	public async getKnownWords (): Promise<KnownWord> {
		const storage = await this.getStorage();
		const storedData: KnownWord | null = await storage.get(this.knownWordsKey);
		return storedData || {};
	}

	public async getMisspelledWords (): Promise<MisspelledWord> {
		const storage = await this.getStorage();
		const storedData: MisspelledWord | null = await storage.get(this.misspelledWordsKey);
		return storedData || {};
	}

	public async getWordsToReview (): Promise<WordToReview> {
		const storage = await this.getStorage();
		const storedData: WordToReview | null = await storage.get(this.reviewingWordsKey);
		return storedData || {};
	}

	public async setKnownWords (value: KnownWord): Promise<void> {
		const storage = await this.getStorage();
		await storage.set(this.knownWordsKey, value);
	}

	public async setMisspelledWords (value: MisspelledWord): Promise<void> {
		const storage = await this.getStorage();
		await storage.set(this.misspelledWordsKey, value);
	}

	public async setWordsToReview (value: WordToReview): Promise<void> {
		const storage = await this.getStorage();
		await storage.set(this.reviewingWordsKey, value);
	}

	private async getStorage (): Promise<Storage> {
		if (!this.storage)
			this.storage = await this.storageLib.create();

		return this.storage;
	}
}
