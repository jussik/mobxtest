import * as React from "react";
import { action } from "mobx";
import { observer, inject } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/fontawesome-free-solid";

import { RowStoreView } from "../common/RowStoreView";

@inject("view")
@observer
export class ViewFilter extends React.Component<{ view?: RowStoreView }, {}> {
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