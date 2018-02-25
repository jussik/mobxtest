import * as React from "react";
import { action, observable } from "mobx";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare } from "@fortawesome/fontawesome-free-regular";

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
    @action toggle() {
        this.active = !this.active;
    }
}

@observer
class RowComponent extends React.Component<{ row: TableRow }, {}> {
    render() {
        const row = this.props.row;
        return <tr style={{cursor:"pointer"}} onClick={()=>row.toggle()}>
            <td><FontAwesomeIcon icon={row.active ? faCheckSquare : faSquare} /></td>
            <td>{row.text}</td>
        </tr>;
    }
}

@observer
export default class Main extends React.Component<{}, {}> {
    rows: TableRow[];
    constructor(props: {}) {
        super(props);
        this.rows = [
            new TableRow("A test"),
            new TableRow("Another test"),
            new TableRow("And another one"),
            new TableRow("Zoop"),
            new TableRow("Bop")
        ];
    }
    render() {
        return <section className="section">
            <ul className="tabs">
                <li className="is-active"><a>Table test</a></li>
            </ul>
            <div>
                <h1 className="title">Testing...</h1>
                <table className="table is-fullwidth is-striped is-hoverable">
                    <thead>
                        <tr>
                            <th style={{ width: "28px" }} />
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>{
                        this.rows.map(r => <RowComponent key={r.id} row={r} />)
                    }</tbody>
                </table>
                <div>{this.rows.reduce((s, r) => s += r.active ? 1 : 0, 0)} of {this.rows.length} selected</div>
            </div>
        </section>;
    }
}