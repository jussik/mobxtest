import * as React from "react";
import { observable, action } from "mobx";
import { observer, Provider } from "mobx-react";

import { RowStore } from "../common/RowStore";

interface TabModule {
    default: any
}

class Tab {
    @observable component: any = null;
    constructor(
        readonly title: string,
        readonly moduleFetcher: () => Promise<TabModule>
    ) { }
    @action.bound private moduleLoaded(mod: TabModule) {
        this.component = mod.default;
    }
    load() {
        if (this.component == null) {
            this.moduleFetcher().then(this.moduleLoaded);
        }
    }
}

@observer
export default class MainPage extends React.Component<{}, {}> {
    readonly store = new RowStore();
    private readonly tabs = [
        new Tab("Table test", () => import("./TableTab")),
        new Tab("Other", () => import("./OtherTab"))
    ];
    @observable private currentTab: Tab;

    constructor(props: {}, context: any) {
        super(props, context);
        this.currentTab = this.tabs[0];
        this.currentTab.load();
    }
    @action.bound private setTab(tab: Tab) {
        this.currentTab = tab;
        tab.load();
    }
    render() {
        const tab = this.currentTab;
        const tabHeaders = this.tabs.map((t, i) =>
            <li key={i} className={tab === t ? "is-active" : ""} onClick={() => this.setTab(t)}>
                <a>{t.title}</a>
            </li>);

        return <Provider rowStore={this.store}>
            <section className="section">
                <div className="tabs">
                    <ul>{tabHeaders}</ul>
                </div>
                {tab.component ? React.createElement(tab.component) : <span>Loading...</span>}
            </section>
        </Provider>;
    }
}