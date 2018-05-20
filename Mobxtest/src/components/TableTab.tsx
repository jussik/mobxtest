import * as React from "react";
import { action } from "mobx";
import { observer, inject } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faCheckSquare, faMinusSquare, faSquare } from "@fortawesome/free-regular-svg-icons";

import { RowStore } from "../common/RowStore";
import { RowStoreView } from "../common/RowStoreView";
import { TableRow } from "../common/TableRow";
import { ViewFilter } from "./ViewFilter";
import { RowComponent } from "./RowComponent";
import { RowForm } from "./RowForm";

@inject("rowStore")
@observer
export default class TableTab extends React.Component<{ rowStore?: RowStore }, {}> {
    readonly view: RowStoreView;
    constructor(props: {}, context: any) {
        super(props, context);
        this.view = new RowStoreView(this.store);
    }
    @action.bound removeRow(row: TableRow) {
        this.store.remove(row);
    }
    get store(): RowStore {
        return this.props.rowStore!;
    }
    render() {
        let allIcon: IconDefinition;
        switch (this.store.allSelected) {
            case true: allIcon = faCheckSquare; break;
            case false: allIcon = faSquare; break;
            default: allIcon = faMinusSquare; break;
        }

        return <div>
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
        </div>;
    }
}