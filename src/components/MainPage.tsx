import * as React from "react";
import { observable, action } from "mobx";
import { observer, Provider } from "mobx-react";

import { RowStore } from "../common/RowStore";
import TableTab from "./TableTab";
import OtherTab from "./OtherTab";

@observer
export default class MainPage extends React.Component<{}, {}> {
    readonly store = new RowStore();
    readonly tabs = ["Table test", "Other"];
    @observable currentTab = 0;
    @action.bound setTab(tab: number) {
        this.currentTab = tab;
    }
    render() {
        let tab: any;
        switch (this.currentTab) {
            case 0:
                tab = <TableTab/>;
                break;
            case 1:
                tab = <OtherTab/>;
                break;
            default:
                throw new Error(`Unhandled tab: ${this.currentTab}`);
        }

        const tabHeaders = this.tabs.map((t, i) => <li key={i} className={this.currentTab === i ? "is-active" : ""} onClick={() => this.setTab(i)}><a>{t}</a></li>);

        return <Provider rowStore={this.store}>
            <section className="section">
                <div className="tabs">
                    <ul>{tabHeaders}</ul>
                </div>
                {tab}
            </section>
        </Provider>;
    }
}