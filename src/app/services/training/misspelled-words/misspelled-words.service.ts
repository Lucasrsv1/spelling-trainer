import { Injectable } from "@angular/core";

import { ITrainingService } from "../training.service";

@Injectable({ providedIn: "root" })
export class MisspelledWordsService implements ITrainingService {
	constructor () { }
}
