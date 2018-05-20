import * as React from "react";
import { action, observable } from "mobx";

export class TableRow {
    private static idCounter = 0;
    readonly id: number;
    readonly text: string;
    @observable active: boolean;
    constructor(text: string, active: boolean = false) {
        this.id = ++TableRow.idCounter;
        this.text = text;
        this.active = active;
    }
    @action.bound toggle() {
        this.active = !this.active;
    }
}