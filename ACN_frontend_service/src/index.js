import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Landingpage from "./sections/Landingpage/Landingpage.js";
import Home from "./sections/Home/HomePage";

ReactDOM.render(
  <Router>
    <Route exact path="/" component={Landingpage} />
    <Route exact path="/home" component={Home} />
  </Router>,
  document.getElementById("root")
);

reportWebVitals();
