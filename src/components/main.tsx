import * as React from "react";
import { action, observable, computed } from "mobx";
import { observer, Provider, inject } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faCheckSquare, faMinusSquare, faSquare } from "@fortawesome/fontawesome-free-regular";

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
    add(text: string, active?: boolean) {
        this.rows.push(new TableRow(text, active || this.allSelected || false));
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
class RowComponent extends React.Component<{ row: TableRow }, {}> {
    render() {
        const row = this.props.row;
        return <tr style={{cursor:"pointer"}} onClick={row.toggle}>
            <td><FontAwesomeIcon icon={row.active ? faCheckSquare : faSquare} /></td>
            <td>{row.text}</td>
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

@observer
export default class Main extends React.Component<{}, {}> {
    readonly store = new RowStore();
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
                    <table className="table is-fullwidth is-striped is-hoverable">
                        <thead>
                            <tr>
                                <th onClick={this.store.toggleAllSelected} style={{ width: "1px", cursor: "pointer" }}>
                                    <FontAwesomeIcon icon={allIcon} />
                                </th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>{
                            this.store.rows.map(r => <RowComponent key={r.id} row={r} />)
                        }</tbody>
                    </table>
                    <RowForm />
                    <div>{this.store.selectedLength} of {this.store.length} selected</div>
                </div>
            </section>
        </Provider>;
    }
}