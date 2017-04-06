// Creating action class
export class Action {
    constructor(private firstValue: string, private secondValue: number) { }

    public get FirstValue() {
        return this.firstValue;
    }
    public get SecondValue() {
        return this.secondValue;
    }
}
