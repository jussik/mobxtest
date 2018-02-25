import "./index.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { useStrict } from "mobx";

useStrict(true);

import Main from "./components/main";

ReactDOM.render(
    <Main />,
    document.getElementById("main")
);