import React, {Component} from "react";
import {ButtonBase, List, ListItem, Grid, Button} from "@material-ui/core";
import Calendar from "react-calendar";
import moment from "moment";
import {findActualDate} from "../../utils/dateRangeUtil";
import "react-calendar/dist/Calendar.css";
import "./DateRangeSelection.scss";

class DateRangeSelection extends Component{
  constructor(props){
    super(props);
    this.state={
      dateFrom: props.dateFrom,
      dateTo: props.dateTo,
      isCustomActive: (typeof props.dateFrom==="string") && (typeof props.dateTo==="string") && (props.dateFrom!=="all" || props.dateTo!=="all")
    };
  }

  handleDynamicDateRangeSelected = (index) => {
    this.setState({
      dateFrom: this.props.dynamicDateRangeLabelOptions[index].dateFrom,
      dateTo: this.props.dynamicDateRangeLabelOptions[index].dateTo,
      isCustomActive: false
    });
  }

  handleCustomClicked = () => {
    this.setState({
      isCustomActive: true,
      dateFrom: "all",
      dateTo: "all"
    });
  }

  handleStaticDateFromChanged = (newValue) => {
    let dateTo = this.state.dateTo;
    if(typeof dateTo !== "string"){
      dateTo = "all";
    }
    this.setState({
      dateFrom: moment(newValue).format("YYYY-MM-DD"),
      dateTo: dateTo,
      isCustomActive: true
    });
  }

  handleStaticDateToChanged = (newValue) => {
    let dateFrom = this.state.dateFrom;
    if(typeof dateFrom !== "string"){
      dateFrom = "all";
    }
    this.setState({
      dateFrom: dateFrom,
      dateTo: moment(newValue).format("YYYY-MM-DD"),
      isCustomActive: true
    });
  }

  handleResetClicked = () => {
    this.setState({
      dateFrom: "all",
      dateTo: "all",
      isCustomActive: false
    });
  }

  handleSaveClicked = () => {
    this.props.handleDateRangeModalClosed();
    this.props.handleDateFromDateToChanged(this.state.dateFrom, this.state.dateTo);
  }

  render(){
    return(
      <div id="dateRangeSelectionContainer">
        <div id="headerSection">
          <ButtonBase className="close" onClick={this.props.handleDateRangeModalClosed}>X</ButtonBase>
        </div>
        <div id="bodySection">
          <div id="dynamicDateRangeContainer">
            <List>
              {
                this.props.dynamicDateRangeLabelOptions.map((dateRange,index) => (
                  <ListItem
                    key={`dynamic_date_range_${index}`}
                    button
                    dense
                    className="dynamicDataRangeListItem"
                    selected={!this.state.isCustomActive && dateRange.value===`${this.state.dateFrom} to ${this.state.dateTo}`}
                    onClick={()=>this.handleDynamicDateRangeSelected(index)}
                  >
                    {dateRange.label}
                  </ListItem>
                ))
              }
              <ListItem
                button
                dense
                className="dynamicDataRangeListItem"
                selected={this.state.isCustomActive}
                onClick={this.handleCustomClicked}
              >
                Custom
              </ListItem>
            </List>
          </div>
          <div className="divider"></div>
          <Grid container className={`staticDateRangeContainer ${this.state.isCustomActive?"":"customInactive"}`}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className="calendarContainer">
              <div className="calendarHeading">
                Start Date
              </div>
              <div className="calendarBody">
                <Calendar
                  calendarType="US"
                  className="reactCalendar"
                  showFixedNumberOfWeeks={true}
                  minDetail="year"
                  onClickDay={(newValue)=>this.handleStaticDateFromChanged(newValue)}
                  value={findActualDate(this.state.dateFrom)}
                  maxDate={findActualDate(this.state.dateTo)}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className="calendarContainer">
              <div className="calendarHeading">
                End Date
              </div>
              <div className="calendarBody">
                <Calendar
                  calendarType="US"
                  className="reactCalendar"
                  showFixedNumberOfWeeks={true}
                  minDetail="year"
                  onClickDay={(newValue)=>this.handleStaticDateToChanged(newValue)}
                  value={findActualDate(this.state.dateTo)}
                  minDate={findActualDate(this.state.dateFrom)}
                />
              </div>
            </Grid>
          </Grid>
        </div>
        <div id="footerButttonSection">
          <div className="actionButtonContainer">
            <Button
              variant="contained"
              size="small"
              onClick={this.props.handleDateRangeModalClosed}
            >
              Cancel
            </Button>
          </div>
          <div className="actionButtonContainer">
            <Button
              variant="contained"
              size="small"
              onClick={this.handleResetClicked}
            >
              Reset
            </Button>
          </div>
          <div className="actionButtonContainer" >
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.handleSaveClicked}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default DateRangeSelection;