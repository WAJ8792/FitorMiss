export const saveCard = (token, saveCustomer) => {
  return $.ajax({
    method: 'POST',
    url: '/cards',
    data: token
  }).then( customer => {
    saveCustomer(customer);
  })
}
