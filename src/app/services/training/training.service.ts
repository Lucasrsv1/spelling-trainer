import { Observable } from "rxjs";

export interface ITrainingService {
	counter$: Observable<number>;
	wordsLoaded$: Observable<boolean>;
	availableWords: string[];
}
