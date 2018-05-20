import * as React from "react";
import { action, observable } from "mobx";
import { observer, inject } from "mobx-react";

import { RowStore } from "../common/RowStore";

@inject("rowStore")
@observer
export class RowForm extends React.Component<{ rowStore?: RowStore }, {}> {
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