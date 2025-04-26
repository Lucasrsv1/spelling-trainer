import { Injectable } from "@angular/core";

import { Storage } from "@ionic/storage-angular";

import { IUser, KnownWords, MisspelledWords, WordsToReview } from "src/app/models/user";

import { AuthenticationService } from "../authentication/authentication.service";

const APP_USERS = "USERS";
const APP_USER_KW_KEY = "USER_KW_";
const APP_USER_MW_KEY = "USER_MW_";
const APP_USER_RW_KEY = "USER_RW_";
const APP_USER_IW_KEY = "USER_IW_";

@Injectable({ providedIn: "root" })
export class AppStorageService {
	private storage?: Storage;

	constructor (
		private readonly storageLib: Storage,
		private readonly authenticationService: AuthenticationService
	) { }

	public async getUsers (): Promise<IUser[]> {
		const storage = await this.getStorage();
		const storedData: IUser[] = await storage.get(APP_USERS);
		return storedData || [];
	}

	public async getKnownWords (user?: IUser): Promise<KnownWords> {
		const storage = await this.getStorage();
		const storedData: KnownWords | null = await storage.get(this.getKnownWordsKey(user));
		return storedData || {};
	}

	public async getMisspelledWords (user?: IUser): Promise<MisspelledWords> {
		const storage = await this.getStorage();
		const storedData: MisspelledWords | null = await storage.get(this.getMisspelledWordsKey(user));
		return storedData || {};
	}

	public async getWordsToReview (user?: IUser): Promise<WordsToReview> {
		const storage = await this.getStorage();
		const storedData: WordsToReview | null = await storage.get(this.getReviewingWordsKey(user));
		return storedData || {};
	}

	public async getIgnoredWords (user?: IUser): Promise<string[]> {
		const storage = await this.getStorage();
		const storedData: string[] | null = await storage.get(this.getIgnoredWordsKey(user));
		return storedData || [];
	}

	public async addUser (user: IUser): Promise<void> {
		const users = await this.getUsers();

		if (!users.some(u => u.uuid === user.uuid)) {
			users.push(user);
			const storage = await this.getStorage();
			await storage.set(APP_USERS, users);
		}
	}

	public async setKnownWords (value: KnownWords, user?: IUser): Promise<void> {
		const storage = await this.getStorage();
		await storage.set(this.getKnownWordsKey(user), value);
	}

	public async setMisspelledWords (value: MisspelledWords, user?: IUser): Promise<void> {
		const storage = await this.getStorage();
		await storage.set(this.getMisspelledWordsKey(user), value);
	}

	public async setWordsToReview (value: WordsToReview, user?: IUser): Promise<void> {
		const storage = await this.getStorage();
		await storage.set(this.getReviewingWordsKey(user), value);
	}

	public async setIgnoredWords (value: string[], user?: IUser): Promise<void> {
		const storage = await this.getStorage();
		await storage.set(this.getIgnoredWordsKey(user), value);
	}

	public async deleteUser (user: IUser): Promise<void> {
		const users = await this.getUsers();
		const index = users.findIndex(u => u.uuid === user.uuid);

		if (index > -1) {
			users.splice(index, 1);
			const storage = await this.getStorage();
			await storage.set(APP_USERS, users);
			await storage.remove(this.getKnownWordsKey(user));
			await storage.remove(this.getMisspelledWordsKey(user));
			await storage.remove(this.getReviewingWordsKey(user));
		}
	}

	private async getStorage (): Promise<Storage> {
		if (!this.storage)
			this.storage = await this.storageLib.create();

		return this.storage;
	}

	private getKnownWordsKey (user?: IUser): string {
		return APP_USER_KW_KEY + ((user || this.authenticationService.user)?.uuid || "");
	}

	private getMisspelledWordsKey (user?: IUser): string {
		return APP_USER_MW_KEY + ((user || this.authenticationService.user)?.uuid || "");
	}

	private getReviewingWordsKey (user?: IUser): string {
		return APP_USER_RW_KEY + ((user || this.authenticationService.user)?.uuid || "");
	}

	private getIgnoredWordsKey (user?: IUser): string {
		return APP_USER_IW_KEY + ((user || this.authenticationService.user)?.uuid || "");
	}
}
