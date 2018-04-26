export const getDiscounts = function(app, setState) {
  app.ref('discounts/discount_list').on('value', snap => {
    if (snap.val()) {
      const ids = Object.keys(snap.val());
      let setNextState = setState(ids);
      ids.forEach( id => {
        findAvailableDiscount(app, id, setNextState);
      })
    }
  });
}

export const findAvailableDiscount = function(app, id, successCB) {
  app.ref('discounts/' + id + '/value').on('value', snap => {
    if (snap.val()) { successCB(snap.val(), id); }
  })
}


export const getCodeUse = function(app, data, setState) {
  data.totalUsed = 0;
  app.ref('reservations').orderByChild('customer_id').equalTo(data.uid).on('value', snap => {
    if (snap.val()) {
      Object.keys(snap.val()).forEach( res => {
        if (snap.val()[res].discount_id === data.discountId) {
          data.totalUsed += 1;
        }
      });
      getCodeLimit(app, data, setState);
    }
  });
}

function getCodeLimit(app, data, setState) {
  app.ref('discounts/' + data.discountId + '/limit').on('value', snap => {
    if (snap.val() && data.totalUsed >= snap.val()) {
      setState();
      nullifyCodeUse(app, data);
    }
  })
}

function nullifyCodeUse(app, data) {
  app.ref(`discounts/${data.discountId}/${data.uid}`).set(false);
}
