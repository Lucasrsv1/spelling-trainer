import { Component, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";

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
export class SpellingInputComponent implements ControlValueAccessor {
	protected focused: boolean = false;
	protected spelledWord?: string = "";

	protected get wordChars (): string[] {
		return (this.spelledWord || "").split("");
	}

	protected onChangeCallback = (value?: string) => { };
	protected onTouched = () => { };

	public keydown (event: KeyboardEvent): void {
		switch (event.key) {
			case "Enter":
				console.log("ENTER:", this.spelledWord);
				break;
			case "Backspace":
			case "Delete":
				if (this.spelledWord && this.spelledWord.length > 0)
					this.spelledWord = this.spelledWord.slice(0, -1);
				break;
			default:
				if (allowedCharacters.includes(event.key.toUpperCase()))
					this.spelledWord += event.key.toLowerCase();
				break;
		}

		this.onChangeCallback(this.spelledWord);
	}

	public writeValue (value: string): void {
		this.spelledWord = value;
	}

	public registerOnChange (fn: any): void {
		this.onChangeCallback = fn;
	}

	public registerOnTouched (fn: any): void {
		this.onTouched = fn;
	}
}
