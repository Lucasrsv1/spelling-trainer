import { Injectable } from "@angular/core";

import { Storage } from "@ionic/storage-angular";

import { IMisspelledWord, IWordToReview } from "src/app/models/user";

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

	public async getKnownWords (): Promise<string[]> {
		const storage = await this.getStorage();
		const storedData: string[] | null = await storage.get(this.knownWordsKey);
		return storedData || [];
	}

	public async getMisspelledWords (): Promise<IMisspelledWord> {
		const storage = await this.getStorage();
		const storedData: IMisspelledWord | null = await storage.get(this.misspelledWordsKey);
		return storedData || {};
	}

	public async getWordsToReview (): Promise<IWordToReview> {
		const storage = await this.getStorage();
		const storedData: IWordToReview | null = await storage.get(this.reviewingWordsKey);
		return storedData || {};
	}

	public async setKnownWords (value: string[]): Promise<void> {
		const storage = await this.getStorage();
		await storage.set(this.knownWordsKey, value.map(w => w.toUpperCase()));
	}

	public async setMisspelledWords (value: IMisspelledWord): Promise<void> {
		const storage = await this.getStorage();
		await storage.set(this.misspelledWordsKey, value);
	}

	public async setWordsToReview (value: IWordToReview): Promise<void> {
		const storage = await this.getStorage();
		await storage.set(this.reviewingWordsKey, value);
	}

	private async getStorage (): Promise<Storage> {
		if (!this.storage)
			this.storage = await this.storageLib.create();

		return this.storage;
	}
}
