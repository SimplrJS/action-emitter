
export class AnyAction {
    constructor(private action: any) { }

    public get Action() {
        return this.action;
    }
}
