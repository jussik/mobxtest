import * as React from "react";
import { observable, computed } from "mobx";

import { RowStore } from "./RowStore";
import { TableRow } from "./TableRow";

export class RowStoreView {
    @observable readonly store: RowStore;
    @observable filter: string = "";
    constructor(store: RowStore) {
        this.store = store;
    }
    @computed get rows(): TableRow[] {
        return this.store.rows.filter(r => r.text.indexOf(this.filter) > -1);
    }
    @computed get selectedLength(): number {
        return this.rows.reduce((s, r) => s += r.active ? 1 : 0, 0);
    }
    @computed get length(): number {
        return this.rows.length;
    }
}