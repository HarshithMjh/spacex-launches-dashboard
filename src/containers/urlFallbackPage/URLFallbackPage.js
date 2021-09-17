import React from "react";
import "./URLFallbackPage.scss";

function URLFallbackPage(){
  return(
    <div id="urlFallbackPageContainer">
      <div id="mainText">Page not found</div>
      <br />
      <div id="secondaryText">
        Go to <a href="/">Launches page</a>
      </div>
    </div>
  );
}

export default URLFallbackPage;