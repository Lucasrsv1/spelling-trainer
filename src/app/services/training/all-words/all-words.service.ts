import { Injectable } from "@angular/core";

import { ITrainingService } from "../training.service";

@Injectable({ providedIn: "root" })
export class AllWordsService implements ITrainingService {
	constructor () { }
}
