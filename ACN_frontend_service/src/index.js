import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Landingpage from "./sections/Landingpage/Landingpage.js";
import Home from "./sections/Home/HomePage";
import EditProfile from "./sections/ProfileEdit/ProfilePage";
import EditProfile2 from "./sections/acn-react-profile-src-sections-ProfileEdit/ProfilePage";



ReactDOM.render(
  <Router>
    <Route exact path="/" component={Landingpage} />
    <Route exact path="/profileedit" component={EditProfile} />
    <Route exact path="/profileedi" component={EditProfile2} />
    <Route exact path="/home" component={Home} />
  </Router>,
  document.getElementById("root")
);

reportWebVitals();
