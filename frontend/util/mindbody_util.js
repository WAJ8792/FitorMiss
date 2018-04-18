import { dayByIndex, hoursFromNow } from './time_and_date_util';

export const getMBSchedule = (db, info, setState) => {
  db.ref('vendor').orderByChild('neighborhood').equalTo(info.neighborhood).on('value', snap => {
    Object.keys(snap.val()).forEach(vendorId => {
      let vendor = snap.val()[vendorId];
      vendor.id = vendorId;
      vendor = Object.assign({}, vendor, info);
      if (vendor.site_id) {
        fetchAmenities(db, vendor, setState);
      }
    });
  });
}

function fetchAmenities(db, vendor, setState) {
  db.ref('amenities').orderByChild('vendor_id').equalTo(vendor.id).on('value', snap => {
    if (snap.val() != null) {
      const amenities = Object.values(snap.val())[0];
      vendor.amenities = amenities;
      fetchMBSchedule(vendor, setState);
    }
  })
}

const fetchMBSchedule = (data, setState) => {
  data.end_date = hoursFromNow(24);
  return $.ajax({
    method: 'GET',
    url: '/schedules',
    data
  }).done( schedule => {
    const formattedSchedule = formatMindbodyClasse(schedule);
    setState(formattedSchedule);
  }).fail( error => {
    console.log(error);
  });
}

function formatMindbodyClasse(schedule) {
  const formattedSchedule = {};
  schedule.forEach( thisClass => {
    const id = thisClass.id;
    const vendor_id = thisClass.vendor_id.toString();
    const dateTime = parseDateTime(
      thisClass.start_date_time,
      thisClass.end_date_time
    );
    thisClass.vendor_id = vendor_id;
    // get through formatting / calculation function
    thisClass.seats = getSeats(thisClass.booking);
    thisClass.max = (thisClass.seats > 0) ? false : true
    thisClass.day = dateTime.day;
    thisClass.time = dateTime.time;
    if (thisClass.description) {
      thisClass.description = formatDescription(thisClass.description);
    }
    thisClass.duration = dateTime.duration;
    // Get an approximation based on class info
    thisClass.type = apprxType(thisClass.name + thisClass.description);
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
  const duration = {
    hours: parseInt(end.slice(11, 13)) - parseInt(start.slice(11, 13)),
    min: parseInt(end.slice(14, 26)) - parseInt(start.slice(14, 26)),
  }
  if (duration.hours < 1) {
    duration.hours = (24 + duration.hours);
    dateTime.day = dayByIndex((new Date(start).getDay()) - 1);
  }
  if (duration.min < 0) {
    duration.hours -= 1;
    duration.min = (60 + duration.min);
  }
  dateTime.duration = duration;
  return dateTime;
}

function getDifference(start, end) {
  return parseInt(end) - parseInt(start);
}

function apprxType(classString) {
  const str = classString.toLowerCase();
  if (str.includes('cardio')) { return 'Cardio'; }
  if (str.includes('pilates')) { return 'Pilates'; }
  if (str.includes('yoga')) { return 'Yoga'; }
  if (str.includes('boxing')) { return 'Boxing'; }
  if (str.includes('rowing')) { return 'Rowing'; }
  return "";
}

function formatDescription(desc) {
  let arr = desc.split(">");
  let string = findString(arr);
  return cleanString(string);
}

function findString(arr) {
  let string = "";
  arr.forEach(section => {
    if (section[0] && section[0] != "<") {
      string = section;
      return;
    }
  });
  return string;
}

function cleanString(string) {
  string = string.split(".");
  string = string[0].split("<");
  return string[0] + ".";
}
