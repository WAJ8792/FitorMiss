export const saveCard = (token, saveCustomer, setState) => {
  return $.ajax({
    method: 'POST',
    url: '/cards',
    data: token
  }).done( customer => {
    saveCustomer(customer.id);
    setState("Card successfully added");
  }).fail( error => {
    setState("Card number is incorrect");
  })
}
