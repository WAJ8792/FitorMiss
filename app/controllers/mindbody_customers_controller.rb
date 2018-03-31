class MindbodyCustomersController < ApplicationController

  def create
      # Build a function to search for an existing mindbody client record by email FIRST.
      # A customer could have signed up with the gym but is reserving the class through us.
    http_request = getRequestParams
    c = { "Client" => {
      'Email' => params[:email],
      'FirstName' => params[:first_name],
      'LastName' => params[:last_name],
      "BirthDate" => "1989-12-12"
    }}
    http_request['Clients'] = c
    message = { 'Request' => http_request }

    client = Savon::Client.new(wsdl: 'https://api.mindbodyonline.com/0_5/ClientService.asmx?wsdl')
    response = client.call(:add_or_update_clients, :message => message)
    id = response.body[:add_or_update_clients_response][:add_or_update_clients_result][:clients][:client][:id]

    render json: id
  end

  def index
    http_request = getRequestParams

    message = { 'Request' => http_request }
    client = Savon::Client.new(wsdl: "https://api.mindbodyonline.com/0_5/ClientService.asmx?wsdl")

    response = client.call(:get_clients, :message => message)
    clients = response.body[:get_clients_response][:get_clients_result][:clients]
    client = false
    if clients
      client = clients.any? do |client|
        client[:LastName] = params[:last_name] &&
        client[:Email] = params[:email]
      end
    end
    print client

    return client
    render json: client
  end

end
