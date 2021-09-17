import React, {Component} from "react";
import { Table, TableContainer, TableBody, TableRow, TableCell, ButtonBase } from "@material-ui/core";
import moment from "moment";
import moment_timezone from "moment-timezone";
import nasaLogo from "../../assets/images/nasa.svg";
import wikipediaLogo from "../../assets/images/wikipedia.svg";
import youtubeLogo from "../../assets/images/youtube.svg";
import "./MissionInfo.scss";

class MissionInfo extends Component{
  constructor(props){
    super(props);
    this.state={};
  }

  launchStatusMap = {
    true: "success",
    false: "failed",
    null: "upcoming"
  };

  tabularDetails = [
    {
      label: "Flight Number",
      value: this.props.launchDetails.flight_number
    },
    {
      label: "Mission Name",
      value: this.props.launchDetails.name
    },
    {
      label: "Rocket Type",
      value: this.props.launchDetails.rocket.type
    },
    {
      label: "Rocket Name",
      value: this.props.launchDetails.rocket.name
    },
    {
      label: "Manufacturer",
      value: this.props.launchDetails.payloads[0].manufacturers.join(", ")
    },
    {
      label: "Nationality",
      value: this.props.launchDetails.payloads[0].nationalities.join(", ")
    },
    {
      label: "Launch Date",
      value: `${moment(this.props.launchDetails.date_utc).format("DD MMMM YYYY")} at ${moment(this.props.launchDetails.date_utc).format("HH:mm zz")} ${moment_timezone.tz(moment_timezone.tz.guess()).format("z")}`
    },
    {
      label: "Payload Type",
      value: this.props.launchDetails.payloads[0].type
    },
    {
      label: "Orbit",
      value: this.props.launchDetails.payloads[0].orbit
    },
    {
      label: "Launch Site",
      value: this.props.launchDetails.launchpad.name
    }
  ];

  render(){
    let {launchDetails} = this.props;
    return(
      <div id="missionInfoContainer">
        <div id="headerSection">
          <ButtonBase className="close" onClick={this.props.handleMoalClosed}>X</ButtonBase>
        </div>
        <div id="bodySection">
          <div id="mainDetails">
            <div id="forLogo">
              <img src={launchDetails.links.patch.small} alt="Mission Logo" id="missionLogo"/>
            </div>
            <div id="forMissionHeadings">
              <div id="line1">
                {launchDetails.name}
                <div className={`launchStatusContainer ${this.launchStatusMap[launchDetails.success]}`}>
                  {this.launchStatusMap[launchDetails.success]}
                </div>
              </div>
              <div id="line2">
                {launchDetails.rocket.name}
              </div>
              <div id="line3">
                {
                  launchDetails.links.presskit &&
                    <div className="iconContainer" onClick={()=>window.open(launchDetails.links.presskit)}>
                      <img src={nasaLogo} alt="Wikipedia" className="linkIcon"/>
                    </div>
                }
                <div className="iconContainer" onClick={()=>window.open(launchDetails.links.wikipedia)}>
                  <img src={wikipediaLogo} alt="Wikipedia" className="linkIcon"/>
                </div>
                <div className="iconContainer" onClick={()=>window.open(launchDetails.links.webcast)}>
                  <img src={youtubeLogo} alt="Youtube" className="linkIcon"/>
                </div>
              </div>
            </div>
          </div>
          <div id="description">
            {launchDetails.details}
            <span id="descriptionWikipedia">
              <a href={launchDetails.links.wikipedia} target="_blank" rel="noreferrer">Wikipedia</a>
            </span>
          </div>
          <TableContainer className="tableContainer">
            <Table stickyHeader>
              <TableBody className="tableBodyContainer">
                {
                  this.tabularDetails.map((details, index) => (
                    <TableRow key={`tabular_info_${index}`}>
                      <TableCell className="label">{details.label}</TableCell>
                      <TableCell className="value">{details.value}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  }
}

export default MissionInfo;