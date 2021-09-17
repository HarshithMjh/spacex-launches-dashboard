import React, {Component} from "react";
import { Select, MenuItem } from "@material-ui/core";
import {Pagination} from "@material-ui/lab";

import "./TablePagination.scss";

class TablePagination extends Component{
  constructor(props){
    super(props);
    this.state={};
  }

  options = [10,20,30];

  render(){
    return(
      <div id="TablePaginationContainer">
        <div id="forLimit">
          Launches per page
          <Select
            value={this.props.launchesPerPage}
            onChange={event => this.props.handleLaunchesPerPageChanged(event.target.value)}
            className="launchPerPageDropdown"
          >
            {
              this.options.map((number, index) => (
                <MenuItem key={`limit_filter_${index}`} value={number}>{number}</MenuItem>
              ))
            }
          </Select>
        </div>
        <div id="forRecordsCountInfo">
          Showing {this.props.launchesPerPage * (this.props.currentPageNumber-1) + (this.props.totalNumberOfRecords>0?1:0)} to {Math.min(this.props.launchesPerPage * this.props.currentPageNumber, this.props.totalNumberOfRecords)} of {this.props.totalNumberOfRecords} Launches
        </div>
        <div id="forPageNavigation">
          <Pagination
            page={this.props.currentPageNumber}
            count={this.props.totalNumberOfPages}
            variant="outlined"
            shape="rounded"
            onChange={(event, newPageNumber) => this.props.handlePageNumberChanged(newPageNumber)}
          />
        </div>
      </div>
    );
  }
}

export default TablePagination;