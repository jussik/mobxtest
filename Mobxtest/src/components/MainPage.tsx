import { hot } from "react-hot-loader";
import * as React from "react";
import * as PropTypes from "prop-types";
import importedComponent from "react-imported-component";
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";
import { Provider, observer } from "mobx-react";

import { RowStore } from "../common/RowStore";

const Loading = () => <div>Loading</div>;
const TableTabAsync = importedComponent(() => import("./TableTab"), { LoadingComponent: Loading });
const OtherTabAsync = importedComponent(() => import("./OtherTab"), { LoadingComponent: Loading });

class Tab {
    constructor(
        readonly path: string,
        readonly title: string,
        readonly component: React.ComponentType
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

class MainPage extends React.Component<{}, {}> {
    readonly store = new RowStore();
    render() {
        return <Provider rowStore={this.store}>
            <Router>
                <section className="section">
                    <TabHeader />
                    <Switch>
                        {tabs.map(tab =>
                            <Route key={tab.path} path={tab.path} component={tab.component}/>
                        )}
                        <Redirect to="/table" />
                    </Switch>
                </section>
            </Router>
        </Provider>;
    }
}

export default hot(module)(MainPage);