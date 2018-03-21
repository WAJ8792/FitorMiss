import { dayByIndex } from './time_and_date_util';

export const getMBSchedule = (setState) => {
  return $.ajax({
    method: 'GET',
    url: '/schedules'
  }).then ( schedule => {
    const formattedSchedule = formatMindbodyClasse(schedule);
    setState(formattedSchedule);
  });
}

function formatMindbodyClasse(schedule) {
  const formattedSchedule = {};
  schedule.forEach( thisClass => {
    const id = thisClass.id;
    const vendor_id = thisClass.vendor_id.toString();
    const vendorInfo = fetchVendorInfo(vendor_id);
    // console.log(thisClass.start_date_time);
    // console.log(new Date(thisClass.start_date_time).toString());
    const dateTime = parseDateTime(
      thisClass.start_date_time,
      thisClass.end_date_time
    );

    thisClass.vendor_id = vendor_id;
    // get through formatting / calculation function
    thisClass.seats = getSeats(thisClass.reservations);
    const max = (thisClass.seats > 0) ? false : true
    thisClass.day = dateTime.day;
    thisClass.time = dateTime.time;
    thisClass.duration = dateTime.duration;
    // Get an approximation based on class info
    thisClass.type = "";

    thisClass.amenities = {
      parking: false,
      towels: false,
      showers: false,
      lockers: false,
      mat_rentals: false
    }
    formattedSchedule[id] = thisClass;
  })
  return formattedSchedule;
}

function getSeats(reservations) {
  const { maxCapacity, totalBooked, webCapacity, webBooked } = reservations
  if (maxCapacity - totalBooked > webCapacity) {
    return maxCapacity - totalBooked;
  }
  else {
    return webCapacity - webBooked;
  }
}

function parseDateTime(start, end) {
  const dateTime = {};
  dateTime.day = dayByIndex(new Date(start).getDay());
  dateTime.time = start.slice(11, 16);
  dateTime.duration = {
    hours: parseInt(end.slice(11, 13)) - parseInt(start.slice(11, 13)),
    min: parseInt(end.slice(14, 26)) - parseInt(start.slice(14, 26)),
  }
  return dateTime;
}

function getDifference(start, end) {
  return parseInt(end) - parseInt(start);
}

