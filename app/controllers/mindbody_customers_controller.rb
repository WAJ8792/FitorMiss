class MindbodyCustomersController < ApplicationController

  def create
      # Build a function to search for an existing mindbody client record by email FIRST.
      # A customer could have signed up with the gym but is reserving the class through us.
    http_request = getRequestParams
    c = { "Client" => {
      'email': params[:email],
      'firstName': params[:first_name],
      'lastName': params[:last_name]
    }}
    http_request['Clients'] = c
    message = { 'Request' => http_request }

    client = Savon::Client.new(wsdl: 'https://api.mindbodyonline.com/0_5/ClientService.asmx?wsdl')

    response = client.call(:add_or_update_clients, :message => message)

    # @result = response.body.....
  end

end
