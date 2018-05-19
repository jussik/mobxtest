import * as React from "react";
import { action, observable, computed } from "mobx";
import { observer, Provider, inject } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faCheckSquare, faMinusSquare, faSquare } from "@fortawesome/fontawesome-free-regular";
import { faTimes } from "@fortawesome/fontawesome-free-solid";

class RowStore {
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

class RowStoreView {
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

class TableRow {
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

@observer
class RowComponent extends React.Component<{ row: TableRow, onDelete: (row: TableRow) => void}, {}> {
    @action.bound onDelete(ev: React.MouseEvent<HTMLElement>) {
        this.props.onDelete(this.props.row);
        ev.stopPropagation();
    }
    render() {
        const row = this.props.row;
        return <tr style={{cursor:"pointer"}} onClick={row.toggle}>
            <td><FontAwesomeIcon icon={row.active ? faCheckSquare : faSquare} /></td>
            <td>{row.text}</td>
            <td><a className="delete" onClick={this.onDelete} /></td>
        </tr>;
    }
}

@inject("rowStore")
@observer
class RowForm extends React.Component<{ rowStore?: RowStore }, {}> {
    @observable private name: string = "";
    @action.bound nameChanged(e: React.FormEvent<HTMLInputElement>) {
        this.name = e.currentTarget.value;
    }
    @action.bound submit(e: React.FormEvent<HTMLFormElement>) {
        this.props.rowStore!.add(this.name);
        this.name = "";
        e.preventDefault();
    }
    render() {
        return <form className="field has-addons" onSubmit={this.submit}>
            <div className="control">
                <input className="input" type="text" placeholder="Name" required
                    value={this.name} onChange={this.nameChanged} />
            </div>
            <div className="control">
                <button type="submit" className="button">Add</button>
            </div>
        </form>;
    }
}

@inject("view")
@observer
class ViewFilter extends React.Component<{ view?: RowStoreView }, {}> {
    @action.bound filterChanged(e: React.FormEvent<HTMLInputElement>) {
        this.props.view!.filter = e.currentTarget.value;
    }
    @action.bound clearFilter() {
        this.props.view!.filter = "";
    }
    render() {
        return <div className="field has-addons">
            <div className="control">
                <input className="input" type="text" placeholder="Filter"
                    value={this.props.view!.filter} onChange={this.filterChanged} />
            </div>
            <div className="control">
                <button className="button" onClick={this.clearFilter}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </button>
            </div>
        </div>;
    }
}

@observer
export default class Main extends React.Component<{}, {}> {
    readonly store = new RowStore();
    readonly view: RowStoreView;
    constructor(props: {}, context: any) {
        super(props, context);
        this.view = new RowStoreView(this.store);
    }
    @action.bound removeRow(row: TableRow) {
        this.store.remove(row);
    }
    render() {
        let allIcon: IconDefinition;
        switch (this.store.allSelected) {
            case true: allIcon = faCheckSquare; break;
            case false: allIcon = faSquare; break;
            default: allIcon = faMinusSquare; break;
        }

        return <Provider rowStore={this.store}>
            <section className="section">
                <div className="tabs">
                    <ul>
                        <li className="is-active"><a>Table test</a></li>
                    </ul>
                </div>
                <div>
                    <ViewFilter view={this.view} />
                    <table className="table is-fullwidth is-striped is-hoverable">
                        <thead>
                            <tr>
                                <th onClick={this.store.toggleAllSelected} style={{ width: "1px", cursor: "pointer" }}>
                                    <FontAwesomeIcon icon={allIcon} className={this.store.length === 0 ? "has-text-grey-light" : ""} />
                                </th>
                                <th>Name</th>
                                <th style={{ width: "1px" }} />
                            </tr>
                        </thead>
                        <tbody>{
                            this.view.rows.map(r => <RowComponent key={r.id} row={r} onDelete={this.removeRow} />)
                        }</tbody>
                    </table>
                    <RowForm />
                    <div>{this.view.selectedLength} of {this.view.length} selected</div>
                </div>
            </section>
        </Provider>;
    }
}