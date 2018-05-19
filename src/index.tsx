import "./index.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { useStrict } from "mobx";

useStrict(true);

import MainPage from "./components/MainPage";

ReactDOM.render(
    <MainPage />,
    document.getElementById("main")
);