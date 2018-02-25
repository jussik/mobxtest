import * as React from "react";
import { action, observable, computed } from "mobx";
import { observer, Provider, inject } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare } from "@fortawesome/fontawesome-free-regular";

class RowStore {
    @observable readonly rows: TableRow[] = [];
    @computed get length() {
        return this.rows.length;
    }
    @computed get selectedLength() {
        return this.rows.reduce((s, r) => s += r.active ? 1 : 0, 0);
    }
    add(text: string, active: boolean = false) {
        this.rows.push(new TableRow(text, active));
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
                                <th style={{ width: "28px" }} />
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