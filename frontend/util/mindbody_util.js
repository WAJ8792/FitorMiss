export const getSchedule = () => {
  return $.ajax({
    method: 'GET',
    url: '/schedules'
  }).then ( schedule => {
    const formattedSchedule = formatMindbodyClasse(schedule);
    // this.setState({
    //   classes: {
    //     ...this.state.classes,
    //     formattedSchedule
    //   }
    // });
  });
}

function formatMindbodyClasse(schedule) {
  const formatted = [];
  schedule.forEach( thisClass => {
    const vendorInfo = fetchVendorInfo(thisClass.vendor_id);
    thisClass.max = false;
    thisClass.vendor = vendorInfo.vendor;
    thisClass.neighborhood = vendorInfo.neighborhood;

  })
}

function fetchVendorInfo(id) {
  firebase.database().ref('vendors').orderByKey().equalTo(id)
  .on('value', snap => {
    if (snap.val() != null) {
      vendor = snap.val()[id]
    }
    return {
      vendor: vendor.gym_name,
      neighborhood: vendor.neighborhood
    }
  })
}

// amenities
// vendor_name
// neighborhood / neighborhood_id
//
// duration
// time
// Date
// day
//
// apprx type
