import React from "react";
import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom';
import Launches from "./containers/launches/Launches";
import URLFallbackPage from "./containers/urlFallbackPage/URLFallbackPage";

function Routes() {
  return(
    <BrowserRouter>
      <Switch>
        <Redirect exact strict from="/" to="/launches" />
        <Route exact path="/launches" component={Launches} />
        <Route path="*" component={URLFallbackPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;