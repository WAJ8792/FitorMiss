class MindbodyCustomersController < ApplicationController

  def create
    http_request = getRequestParams(params[:siteID])
    c = { "Client" => {
      'Email' => params[:userInfo][:email],
      'FirstName' => params[:userInfo][:first_name],
      'LastName' => params[:userInfo][:last_name],
    }}
    http_request['Clients'] = c
    message = { 'Request' => http_request }

    client_service = Savon::Client.new(wsdl: 'https://api.mindbodyonline.com/0_5/ClientService.asmx?wsdl')
    response = client_service.call(:add_or_update_clients, :message => message)
    id = response.body[:add_or_update_clients_response][:add_or_update_clients_result][:clients][:client][:id]

    render json: id
  end

  def index
    http_request = getRequestParams(params[:siteID])
    http_request["SearchText"] = params[:userInfo][:email]
    message = { 'Request' => http_request }

    client_service = Savon::Client.new(wsdl: "https://api.mindbodyonline.com/0_5/ClientService.asmx?wsdl")
    response = client_service.call(:get_clients, :message => message)
    result = response.body[:get_clients_response][:get_clients_result]
    thisUser = false
    print result
    if result[:clients]
      user = result[:clients][:client]
      if user[:last_name] == params[:userInfo][:last_name] && user[:email] == params[:userInfo][:email]
          thisUser = user[:id]
      end
    end

    render json: thisUser
  end

end
