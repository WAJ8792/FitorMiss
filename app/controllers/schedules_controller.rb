class SchedulesController < ApplicationController

  def index
    http_request = getRequestParams(
      params["site_id"]
    )
    print http_request

    request = { 'Request' => http_request }
    client = Savon::Client.new(wsdl: 'https://api.mindbodyonline.com/0_5/ClassService.asmx?wsdl')
    response = client.call(:get_classes, :message => request )
    @classes_list = response.body[:get_classes_response][:get_classes_result][:classes][:class]
    @vendor_info = params

    render 'schedules/index.json'
  end

  def create
    http_request = getRequestParams

    if params[:clientId]
      http_request["ClientID"] = params[:clientId]
    else
      http_request["ClientID"] = params[:newClientId]
    end

    http_request["CartItems"] = {
      "CartItem" => {
        "Item" => { "ID" => "1249" },
        "ClassIDs" => { "int" => params[:classId] },
        "DiscountAmount" => "0",
        "Quantity" => "1"
      },
      :attributes! => { "Item" => {"xsi:type" => "Service"} }
    }
    http_request["Payments"] = {
      "PaymentInfo" => {
        "Amount" => "10"
      },
      :attributes! => { "PaymentInfo" => {"xsi:type" => "CompInfo"} }
    }

    params = { 'Request' => http_request }

    print params

    client = Savon::Client.new(wsdl: 'https://api.mindbodyonline.com/0_5/SaleService.asmx?wsdl')

    response = client.call(:checkout_shopping_cart, :message => params);

    render nil
  end

end
