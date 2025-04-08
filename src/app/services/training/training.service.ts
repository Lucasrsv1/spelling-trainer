import { Observable } from "rxjs";

export interface ITrainingService {
	wordsLoaded$: Observable<boolean>;
	availableWords: string[];
}
