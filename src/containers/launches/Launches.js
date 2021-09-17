import React, {Component} from "react";
import axios from "axios";
import qs from "query-string";
import moment from "moment";
import Filters from "../../components/launches/Filters";
import LaunchesTable from "../../components/launches/LaunchesTable";
import TablePagination from "../../components/launches/TablePagination";
import {findActualDate} from "../../utils/dateRangeUtil";
import "./Launches.scss";

class Launches extends Component{
  constructor(props){
    super(props);
    this.state={
      isLoading: true,
      launches: [],
      totalNumberOfPages: 1,
      currentPageNumber: 1,
      launchStatusFilter: "all",
      totalNumberOfRecords: 0,
      launchesPerPage: 10,
      dateFrom: "all",
      dateTo: "all"
    };
  }

  componentDidMount(){
    this.updateStateAsPerQueryParameters();
  }

  componentDidUpdate(prevProps){
    if(prevProps.location.search !== this.props.location.search){
      this.updateStateAsPerQueryParameters();
    }
  }

  updateStateAsPerQueryParameters = () => {
    this.setState({
      isLoading: true,
      launches: [],
      ...this.validatedQueryParams()
    }, ()=>{
      this.fetchLaunchDetails();
    });
  }

  validatedQueryParams = () => {
    const params = qs.parse(this.props.location.search);
    let areQueryParamsProper = true;
    const returnState = {};
    [returnState["currentPageNumber"], areQueryParamsProper] = this.validateCurrentPageNumber(params.page, areQueryParamsProper);
    [returnState["launchStatusFilter"], areQueryParamsProper] = this.validateLaunchStatusFilter(params.launchsuccess, areQueryParamsProper);
    [returnState["launchesPerPage"], areQueryParamsProper] = this.validateLaunchesPerPage(params.limit, areQueryParamsProper);
    [returnState["dateFrom"], returnState["dateTo"], areQueryParamsProper] = this.validateDateRanges(params.datefrom, params.dateto, areQueryParamsProper);
    if(areQueryParamsProper){
      return returnState;
    }
    this.changeQueryParams({
      page: returnState.currentPageNumber,
      launchsuccess: returnState.launchStatusFilter,
      limit: returnState.launchesPerPage,
      datefrom: returnState.dateFrom,
      dateto: returnState.dateTo
    });
  }

  validateCurrentPageNumber = (currentPageNumber, areQueryParamsProper) => {
    currentPageNumber = parseInt(currentPageNumber);
    if(Number.isInteger(currentPageNumber) && currentPageNumber>0){
      return [currentPageNumber, areQueryParamsProper];
    }
    return [1, false];
  }

  validateLaunchStatusFilter = (launchStatusFilter, areQueryParamsProper) => {
    const launchStatusFilterSupportedValues = ["all", "upcoming", "true", "false"];
    if(launchStatusFilterSupportedValues.includes(launchStatusFilter)){
      return [launchStatusFilter, areQueryParamsProper];
    }
    return ["all", false];
  }

  validateLaunchesPerPage = (launchesPerPage, areQueryParamsProper) => {
    const launchesPerPageOptions = [10, 20, 30];
    launchesPerPage = parseInt(launchesPerPage);
    if(Number.isInteger(launchesPerPage) && launchesPerPageOptions.includes(launchesPerPage)){
      return [ launchesPerPage, areQueryParamsProper];
    }
    return [10, false];
  }

  validateDateRanges = (dateFrom, dateTo, areQueryParamsProper) => {
    const dateRegex = /^\d\d\d\d-\d\d-\d\d$/i;
    //check whether dates are in valid yyyy-mm-dd format or "all"
    //if in yyyy-mm-dd format, then validate whether its a proper date
    if(
      (dateRegex.test(dateFrom) || dateFrom==="all")  
      && (dateRegex.test(dateTo) || dateTo==="all")
    ){
      if(dateFrom!=="all"){
        if(!moment(dateFrom).isValid()){
          dateFrom = "all";
          areQueryParamsProper = false;
        }
      }
      if(dateTo!=="all"){
        if(!moment(dateTo).isValid()){
          dateTo = "all";
          areQueryParamsProper = false;
        }
        else if(dateFrom!=="all"){
          //dateTo should be greater than dateFrom
          if(moment(dateTo).diff(moment(dateFrom),"days") < 0){
            dateTo = "all";
            areQueryParamsProper = false;
          }
        }
      }
      return [dateFrom, dateTo, areQueryParamsProper];
    }
    //if it didn't match to the static date range mentioned above, try to match it with the dynamic ranges
    else{
      let supportedDynamicRanges = ["-7 to 0", "-30 to 0", "-90 to 0", "-180 to 0", "-365 to 0", "0 to 7", "0 to 30"];
      if(supportedDynamicRanges.includes(`${dateFrom} to ${dateTo}`)){
        return [parseInt(dateFrom), parseInt(dateTo), areQueryParamsProper];
      }
    }
    return ["all", "all", false];
  }

  changeQueryParams = (modifyQueryParams) => {
    const params = qs.parse(this.props.location.search);
    this.props.history.replace("/launches?" + qs.stringify({
      page: modifyQueryParams.hasOwnProperty("page")? modifyQueryParams.page : params.page,
      launchsuccess: modifyQueryParams.hasOwnProperty("launchsuccess")? modifyQueryParams.launchsuccess : params.launchsuccess,
      limit: modifyQueryParams.hasOwnProperty("limit")? modifyQueryParams.limit : params.limit,
      datefrom: modifyQueryParams.hasOwnProperty("datefrom")? modifyQueryParams.datefrom : params.datefrom,
      dateto: modifyQueryParams.hasOwnProperty("dateto")? modifyQueryParams.dateto : params.dateto
    }));
  }

  fetchLaunchDetails = () => {
    const query = {};
    if(this.state.launchStatusFilter!=="all"){
      if(this.state.launchStatusFilter!=="upcoming"){
        query["success"] = this.state.launchStatusFilter;
      }
      else{
        query["upcoming"] = true;
      }
    }
    if(this.state.dateFrom!=="all" || this.state.dateTo!=="all"){
      query["date_utc"] = {};
      if(this.state.dateFrom!=="all"){
        query["date_utc"]["$gte"] = findActualDate(this.state.dateFrom);

      }
      if(this.state.dateTo!=="all"){
        query["date_utc"]["$lte"] = findActualDate(this.state.dateTo);
      }
    }
    // query["date_utc"] = {$gte:"2007-03-21",$lte:"2008-08-04"};
    axios({
      method: "POST",
      url: "https://api.spacexdata.com/v4/launches/query",
      data: {
        query: query,
        options: {
          page: this.state.currentPageNumber,
          limit: this.state.launchesPerPage,
          populate: [
            {
              path: "launchpad",
              select: "name"
            },
            {
              path: "payloads",
              select: ["orbit", "manufacturers", "nationalities", "type"]
            },
            {
              path: "rocket",
              select: ["name", "type"]
            }
          ]
        }
      }
    })
      .then(response => {
        if(response.data.totalPages<this.state.currentPageNumber){
          this.handlePageNumberChanged(response.data.totalPages);
          return;
        }
        this.setState({
          launches: response.data.docs,
          totalNumberOfPages: response.data.totalPages,
          totalNumberOfRecords: response.data.totalDocs,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          launches: [],
          isLoading: false
        });
        alert("Unable to get data");
      });
  }

  handlePageNumberChanged = (newPageNumber) => {
    this.changeQueryParams({
      page: newPageNumber
    });
  }

  handleLaunchSuccessFilterChanged = (newLaunchSuccessFilter) => {
    this.changeQueryParams({
      launchsuccess: newLaunchSuccessFilter,
      page: 1
    });
  }

  handleLaunchesPerPageChanged = (newLaunchesPerPage) => {
    this.changeQueryParams({
      limit: newLaunchesPerPage
    });
  }

  handleDateFromDateToChanged = (newDateFrom, newDateTo) => {
    this.changeQueryParams({
      datefrom: newDateFrom,
      dateto: newDateTo,
      page: 1
    });
  }

  render(){
    return(
      <div id="launchesContainer">
        <div id="centerBlock">
          <div id="forFilters">
            <Filters
              dateFrom = {this.state.dateFrom}
              dateTo = {this.state.dateTo}
              handleDateFromDateToChanged = {this.handleDateFromDateToChanged}
              launchStatusFilter = {this.state.launchStatusFilter}
              handleLaunchSuccessFilterChanged = {this.handleLaunchSuccessFilterChanged}
            />
          </div>
          <div id="forTable">
            <LaunchesTable
              isLoading = {this.state.isLoading}
              launches = {this.state.launches}
            />
          </div>
          <div id="forTablePagination">
            <TablePagination
              currentPageNumber = {this.state.currentPageNumber}
              totalNumberOfPages = {this.state.totalNumberOfPages}
              handlePageNumberChanged = {this.handlePageNumberChanged}
              totalNumberOfRecords = {this.state.totalNumberOfRecords}
              launchesPerPage = {this.state.launchesPerPage}
              handleLaunchesPerPageChanged = {this.handleLaunchesPerPageChanged}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Launches;