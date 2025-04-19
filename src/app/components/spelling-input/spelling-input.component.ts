import { AfterViewInit, Component, computed, ElementRef, EventEmitter, forwardRef, Input, input, Output, signal, ViewChild } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";

import { diffChars } from "diff";

interface CharDiff {
	char: string;
	added: boolean;
	removed: boolean;
	switched: string;
}

const allowedCharacters = [
	"'", "-", ".", "A", "B", "C",
	"D", "E", "F", "G", "H", "I",
	"J", "K", "L", "M", "N", "O",
	"P", "Q", "R", "S", "T", "U",
	"V", "W", "X", "Y", "Z"
];

@Component({
	selector: "app-spelling-input",
	templateUrl: "./spelling-input.component.html",
	styleUrls: ["./spelling-input.component.scss"],
	imports: [FormsModule],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => SpellingInputComponent),
		multi: true
	}]
})
export class SpellingInputComponent implements AfterViewInit, ControlValueAccessor {
	@Input()
	public validate: boolean = false;

	@Input()
	public freeText: boolean = false;

	@Output()
	public confirm = new EventEmitter<string>();

	@Output()
	public toggleAudio = new EventEmitter<void>();

	@Output()
	public nextMeaning = new EventEmitter<void>();

	@Output()
	public previousMeaning = new EventEmitter<void>();

	@ViewChild("input")
	protected inputElement?: ElementRef<HTMLInputElement>;

	public expected = input<string>("");

	public ngAfterViewInit (): void {
		setTimeout(() => this.focus(), 500);
	}

	protected validationChanges = computed(() => {
		const changes: CharDiff[] = [];
		const diff = diffChars(this.expected(), this.spelledWord(), { ignoreCase: true });

		for (let i = 0; i < diff.length; i++) {
			if (diff[i].removed && diff[i + 1] && diff[i + 1].added) {
				changes.push(...this.getSwitchedChars(diff[i].value, diff[i + 1].value));
				i++;
				continue;
			}

			if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
				changes.push(...this.getSwitchedChars(diff[i + 1].value, diff[i].value));
				i++;
				continue;
			}

			changes.push(
				...diff[i].value.split("").map(char => ({
					char,
					added: diff[i].added,
					removed: diff[i].removed,
					switched: ""
				}))
			);
		}

		return changes;
	});

	protected focused: boolean = false;
	protected spelledWord = signal("");

	protected get wordChars (): string[] {
		return this.spelledWord().split("");
	}

	protected get expectedWordChars (): string[] {
		return (this.expected() || "").split("");
	}

	protected onChangeCallback = (value?: string) => { };
	protected onTouched = () => { };

	public focus (): void {
		this.inputElement?.nativeElement.focus();
	}

	public keydown (event: KeyboardEvent): void {
		if (["Enter", "Tab"].includes(event.key))
			return this.confirm.emit(this.spelledWord());

		if (!this.freeText && ["Spacebar", " "].includes(event.key))
			return this.toggleAudio.emit();

		if (["ArrowRight", "ArrowUp"].includes(event.key))
			return this.nextMeaning.emit();

		if (["ArrowLeft", "ArrowDown"].includes(event.key))
			return this.previousMeaning.emit();

		if (this.validate)
			return;

		if (["Backspace", "Clear", "Delete", "Del"].includes(event.key) && this.spelledWord().length > 0)
			this.spelledWord.set(this.spelledWord().slice(0, -1));
		else if (this.freeText && event.key.length === 1)
			this.spelledWord.set(this.spelledWord() + event.key);
		else if (allowedCharacters.includes(event.key.toUpperCase()))
			this.spelledWord.set(this.spelledWord() + event.key.toLowerCase());

		this.onChangeCallback(this.spelledWord());
	}

	public writeValue (value?: string): void {
		this.spelledWord.set(value || "");
	}

	public registerOnChange (fn: any): void {
		this.onChangeCallback = fn;
	}

	public registerOnTouched (fn: any): void {
		this.onTouched = fn;
	}

	private getSwitchedChars (removed: string, added: string): CharDiff[] {
		const changes: CharDiff[] = [];
		const length = Math.max(removed.length, added.length);

		for (let j = 0; j < length; j++) {
			if (j < removed.length && j < added.length) {
				changes.push({
					char: added[j],
					added: false,
					removed: false,
					switched: removed[j]
				});
			} else if (j < removed.length) {
				changes.push({
					char: removed[j],
					added: false,
					removed: true,
					switched: ""
				});
			} else {
				changes.push({
					char: added[j],
					added: true,
					removed: false,
					switched: ""
				});
			}
		}

		return changes;
	}
}
