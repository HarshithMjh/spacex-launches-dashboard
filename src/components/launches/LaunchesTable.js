import React, {Component} from "react";
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Modal } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import moment from "moment";
import moment_timezone from "moment-timezone";
import MissionInfo from "./MissionInfo";
import "./LaunchesTable.scss";

class LaunchesTable extends Component{
  constructor(props){
    super(props);
    this.state={
      selectedIndex: -1,
      isModalOpen: false
    };
  }

  columns = ["No", `Launched (${moment_timezone.tz(moment_timezone.tz.guess()).format("z")})`, "Location", "Mission", "Orbit", "Launch Status", "Rocket"];
  launchStatusMap = {
    true: "success",
    false: "failed",
    null: "upcoming"
  }

  handleRowClicked = (index) => {
    this.setState({
      selectedIndex: index,
      isModalOpen: true
    });
  }

  handleMoalClosed = (index) => {
    this.setState({
      isModalOpen: false
    })
  }

  render(){
    return(
      <div id="launchesTableContainer">
        <TableContainer className="tableContainer">
          <Table stickyHeader>
            <TableHead className="tableHeadContainer">
              <TableRow>
                {
                  this.columns.map((column, index) => (
                    <TableCell size="small" className="tableColumn" key={`column_${index}`}>{column}</TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody className="tableBodyContainer">
              {
                this.props.isLoading &&
                  [...new Array(20)].map((data, i) => (
                    <TableRow key={`loading_row_${i}`}>
                      {
                        this.columns.map(column => (
                          <TableCell key={`loading_column_${i}_${column}`}>
                            <Skeleton variant="rect" animation="wave" width={90} height={15} />
                          </TableCell>
                        ))
                      }
                    </TableRow>
                  ))
              }
              {
                !this.props.isLoading && this.props.launches.length===0 &&
                  <TableRow>
                    <TableCell colSpan={this.columns.length} align="center">No results found</TableCell>
                  </TableRow> 
              }
              {
                !this.props.isLoading &&
                  this.props.launches.map((launchDetails, index) => (
                    <TableRow
                      key={`row_${index}`}
                      className="missionRecord"
                      onClick={()=>this.handleRowClicked(index)}
                    >
                      <TableCell className="tableRowCell">{launchDetails.flight_number}</TableCell>
                      <TableCell className="tableRowCell">
                        {moment(launchDetails.date_utc).format("Do MMM YYYY")} at {moment(launchDetails.date_utc).format("HH:mm zz")}
                      </TableCell>
                      <TableCell className="tableRowCell">{launchDetails.launchpad.name}</TableCell>
                      <TableCell className="tableRowCell">{launchDetails.name}</TableCell>
                      <TableCell className="tableRowCell">{launchDetails.payloads[0].orbit}</TableCell>
                      <TableCell className="tableRowCell">
                        <div className={`launchStatusContainer ${this.launchStatusMap[launchDetails.success]}`}>
                          {this.launchStatusMap[launchDetails.success]}
                        </div>
                      </TableCell>
                      <TableCell className="tableRowCell">{launchDetails.rocket.name}</TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <Modal
          open={this.state.isModalOpen}
          onClose={this.handleMoalClosed}
        >
          {
            !this.state.isModalOpen?(
              <></>
            ):(
              <MissionInfo
                launchDetails={this.props.launches[this.state.selectedIndex]}
                handleMoalClosed={this.handleMoalClosed}
              />
            )
          }
        </Modal>
      </div>
    );
  }
}

export default LaunchesTable;