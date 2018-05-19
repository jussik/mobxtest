import * as React from "react";
import { action, observable, computed } from "mobx";

import { TableRow } from "./TableRow";

export class RowStore {
    @observable readonly rows: TableRow[] = [];
    @computed get length(): number {
        return this.rows.length;
    }
    @computed get selectedLength(): number {
        return this.rows.reduce((s, r) => s += r.active ? 1 : 0, 0);
    }
    @computed get allSelected(): boolean | null {
        if (this.rows.length === 0)
            return false;

        let some = false, all = true;
        for (let row of this.rows) {
            if (row.active) {
                some = true;
            } else {
                all = false;
            }
        }
        if (all)
            return true;

        return some ? null : false;
    }
    @action.bound toggleAllSelected() {
        const active = !this.allSelected;
        for (let row of this.rows) {
            row.active = active;
        }
    }
    @action add(text: string, active?: boolean) {
        this.rows.push(new TableRow(text, active || this.allSelected || false));
    }
    @action remove(row: TableRow) {
        const ix = this.rows.indexOf(row);
        if (ix !== -1)
            this.rows.splice(ix, 1);
    }
}