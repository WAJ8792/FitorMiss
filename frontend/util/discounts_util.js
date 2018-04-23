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

export const findAvailableDiscount = function(app, id, setState) {
  app.ref('discounts/' + id + '/value').on('value', snap => {
    if (snap.val()) { setState(snap.val()); }
  })
}
