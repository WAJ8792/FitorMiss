export const saveCard = (token, saveCustomer) => {
  return $.ajax({
    method: 'POST',
    url: '/cards',
    data: token
  }).then( customer => {
    console.log(customer);
    saveCustomer(customer.id);
  })
}
