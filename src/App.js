import React from "react";
import Routes from "./Routes";
import SpacexLogo from "./assets/images/spacex.svg"
import "./App.scss";

function App() {
  return (
    <div id="appContainer">
      <div id="appHeader">
        <img id="logoSvg" src={SpacexLogo} alt="SpaceX Logo"/>
      </div>
      <div id="appBody">
        <Routes />
      </div>
    </div>
  );
}

export default App;
