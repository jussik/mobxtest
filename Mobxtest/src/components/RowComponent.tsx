import * as React from "react";
import { action } from "mobx";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";

import { TableRow } from "../common/TableRow";

@observer
export class RowComponent extends React.Component<{ row: TableRow; onDelete: (row: TableRow) => void}, {}> {
    @action.bound onDelete(ev: React.MouseEvent<HTMLElement>) {
        this.props.onDelete(this.props.row);
        ev.stopPropagation();
    }
    render() {
        const row = this.props.row;
        return <tr style={{ cursor: "pointer" }} onClick={row.toggle}>
            <td><FontAwesomeIcon icon={row.active ? faCheckSquare : faSquare} /></td>
            <td>{row.text}</td>
            <td><a className="delete" onClick={this.onDelete} /></td>
        </tr>;
    }
}