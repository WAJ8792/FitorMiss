class SchedulesController < ApplicationController

  def index
    http_request = getRequestParams(
      params["site_id"]
    )
    http_request["SchedulingWindow"] = true
    http_request["EndDateTime"] = params[:end_date]
    print params[:end_date]

    request = { 'Request' => http_request }
    client = Savon::Client.new(wsdl: 'https://api.mindbodyonline.com/0_5/ClassService.asmx?wsdl')
    response = client.call(:get_classes, :message => request )
    @classes_list = response.body[:get_classes_response][:get_classes_result][:classes][:class]
    print @classes_list[-1]
    @vendor_info = params

    render 'schedules/index.json'
  end

  def create
    http_request = getRequestParams(params[:data][:siteID])
    http_request["ClientIDs"] = {"string" => params[:clientId]}
    http_request["ClassIDs"] = {"int" => params[:classId]}
    http_request["ClientServiceID"] = params[:data][:serviceID]

    message = { 'Request' => http_request }

    client = Savon::Client.new(wsdl: 'https://api.mindbodyonline.com/0_5/ClassService.asmx?wsdl')

    response = client.call(:add_clients_to_classes, :message => message);
    result = response.body
      [:add_clients_to_classes_response]
      [:add_clients_to_classes_result]
      [:status]

    render json: [result]
  end

end
