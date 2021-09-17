import React, {Component} from "react";
import { Select, MenuItem, ButtonBase, Modal } from "@material-ui/core";
import moment from "moment";
import CalendarSvg from "../../assets/images/calendar.svg";
import FilteSvg from "../../assets/images/filter.svg"
import DateRangeSelection from "./DateRangeSelection";
import "./Filters.scss";

class Filters extends Component{
  constructor(props){
    super(props);
    this.state={
      isDateRangeSectionModalOpen: false
    };
  }

  dynamicDateRangeLabelOptions = [
    {label: "Past Week", value: "-7 to 0", dateFrom: -7, dateTo: 0},
    {label: "Past Month", value: "-30 to 0", dateFrom: -30, dateTo: 0},
    {label: "Past 3 Months", value: "-90 to 0", dateFrom: -90, dateTo: 0},
    {label: "Past 6 Months", value: "-180 to 0", dateFrom: -180, dateTo: 0},
    {label: "Past Year", value: "-365 to 0", dateFrom: -365, dateTo: 0},
    {label: "Next Week", value: "0 to 7", dateFrom: 0, dateTo: 7},
    {label: "Next Month", value: "0 to 30", dateFrom: 0, dateTo: 30},
    {label: "All time", value: "all to all", dateFrom: "all", dateTo: "all"}
  ]

  launchStatusOptions = [
    { label: "All Launches", value: "all"},
    { label: "Upcoming Lauches", value: "upcoming" },
    { label: "Successful Launches", value: "true"},
    { label: "Failed Lauches", value: "false"}
  ]

  getDateRangeLabelText = () => {
    let {dateFrom, dateTo} = this.props;
    const momentDateFormat = "Do MMM YYYY";
    let matchedDynamicDateRange = this.dynamicDateRangeLabelOptions.filter(row => row.value===`${dateFrom} to ${dateTo}`);
    if(matchedDynamicDateRange.length === 1){
      return matchedDynamicDateRange[0].label;
    }
    if(dateFrom === "all"){
      return `Before ${moment(dateTo).format(momentDateFormat)}`;
    }
    if(dateTo === "all"){
      return `After ${moment(dateFrom).format(momentDateFormat)}`;
    }
    return `From ${moment(dateFrom).format(momentDateFormat)} to ${moment(dateTo).format(momentDateFormat)}`;
  }

  handleDateRangeModalOpened = () => {
    this.setState({
      isDateRangeSectionModalOpen: true
    });
  }

  handleDateRangeModalClosed = () => {
    this.setState({
      isDateRangeSectionModalOpen: false
    });
  }

  render(){
    return(
      <div id="filtersContainer">
        <ButtonBase className="forDateRangeSelection" onClick={this.handleDateRangeModalOpened}>
          <img src={CalendarSvg} alt="" className="svgIcon" />
          <div>{this.getDateRangeLabelText()}</div>
          <div id="bottomArrow"></div>
        </ButtonBase>
        <div id="forSomething">

        </div>
        <img src={FilteSvg} alt="" className="svgIcon" />
        <div id="forLaunchStatusDropdown">
          <Select
            value={this.props.launchStatusFilter}
            onChange={event => this.props.handleLaunchSuccessFilterChanged(event.target.value)}
            className="launchStatusDropdown"
          >
            {
              this.launchStatusOptions.map((itemDetails, index) => (
                <MenuItem key={`success_filter_${index}`} value={itemDetails.value}>{itemDetails.label}</MenuItem>
              ))
            }
          </Select>
        </div>
        <Modal
          open={this.state.isDateRangeSectionModalOpen}
          onClose={this.handleDateRangeModalClosed}
          className="dateRangeModal"
        >
          {
            !this.state.isDateRangeSectionModalOpen?(
              <></>
            ):(
              <DateRangeSelection
                handleDateRangeModalClosed={this.handleDateRangeModalClosed}
                dynamicDateRangeLabelOptions={this.dynamicDateRangeLabelOptions}
                dateFrom={this.props.dateFrom}
                dateTo={this.props.dateTo}
                handleDateFromDateToChanged={this.props.handleDateFromDateToChanged}
              />
            )
          }
        </Modal>
      </div>
    );
  }
}

export default Filters;