import moment from "moment";

function findActualDate(date){
  const dateRegex = /^\d\d\d\d-\d\d-\d\d$/i;
  if(date==="all"){
    return null;
  }
  if(dateRegex.test(date)){
    return new Date(date);
  }
  return new Date(moment().add(date, 'd').format("YYYY-MM-DD"));
}

export {findActualDate};