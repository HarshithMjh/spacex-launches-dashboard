import React, {Component} from "react";
import "./ErrorBoundary.scss";

class ErrorBoundary extends Component{
  constructor(props){
    super(props);
    this.state={
      hasCaughtError: false
    };
  }

  componentDidCatch(error, errorInfo){
    this.setState({
      hasCaughtError: true
    });
  }

  render(){
    if(this.state.hasCaughtError){
      return(
        <div id="errorBoundaryContainer">
          An unanticipated error occured. We will try to fix it soon
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;