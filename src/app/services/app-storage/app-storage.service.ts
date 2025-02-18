import { Injectable } from "@angular/core";

import { Storage } from "@ionic/storage-angular";

@Injectable({ providedIn: "root" })
export class AppStorageService {
	private storage?: Storage;

	constructor (private readonly storageLib: Storage) { }

	private async getStorage (): Promise<Storage> {
		if (!this.storage)
			this.storage = await this.storageLib.create();

		return this.storage;
	}
}
