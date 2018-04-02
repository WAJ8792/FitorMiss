export const saveCard = (token, saveCustomer, setState) => {
  return $.ajax({
    method: 'POST',
    url: '/cards',
    data: token
  }).done( customer => {
    console.log(customer);
    const last4 = customer.sources.data[0].last4;
    saveCustomer(customer.id, last4);
    setState("Card successfully added");
  }).fail( error => {
    setState("Card number is incorrect");
  })
}
