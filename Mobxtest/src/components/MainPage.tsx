import * as React from "react";
import * as PropTypes from "prop-types";
import Loadable from "react-loadable";
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";
import { Provider } from "mobx-react";

import { RowStore } from "../common/RowStore";

const Loading = () => <div>Loading</div>;
const TableTabAsync = Loadable({
    loader: () => import('./TableTab'),
    loading: Loading,
});
const OtherTabAsync = Loadable({
    loader: () => import('./OtherTab'),
    loading: Loading,
});

interface TabModule {
    default: any
}

class Tab {
    constructor(
        readonly path: string,
        readonly title: string,
        readonly component: any
    ) { }
}

const tabs = [
    new Tab("/table", "Table test", TableTabAsync),
    new Tab("/other", "Other", OtherTabAsync)
];

class TabHeader extends React.Component<{}, {}> {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    render() {
        const currentTab = this.context.router.route.location.pathname;
        return <div className="tabs">
            <ul>
                {tabs.map(tab =>
                    <li key={tab.path} className={currentTab === tab.path ? "is-active" : ""}>
                        <Link to={tab.path}>{tab.title}</Link>
                    </li>
                )}
            </ul>
        </div>;
    }
}

export default class MainPage extends React.Component<{}, {}> {
    readonly store = new RowStore();
    render() {
        return <Provider rowStore={this.store}>
            <Router>
                <section className="section">
                    <TabHeader />
                    <Switch>
                        {tabs.map(tab =>
                            <Route key={tab.path} path={tab.path} component={tab.component} />
                        )}
                        <Redirect to="/table" />
                    </Switch>
                </section>
            </Router>
        </Provider>;
    }
}