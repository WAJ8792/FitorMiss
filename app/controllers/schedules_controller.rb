class SchedulesController < ApplicationController

  def index
    site_ids = { 'int' => -99 }
    source_credentials = {
      'SourceName' => 'FitorMiss',
      'Password' => 'KsrvE/bc9IOl/4lKi7o1nbQwDoQ=',
      'SiteIDs' => site_ids
    }
    user_credentials = {
      'Username' => 'Siteowner',
      'Password' => 'apitest1234',
      'SiteIDs' => site_ids
    }

    http_request = {
      'SourceCredentials' => source_credentials,
      'UserCredentials' => user_credentials
    }
    print params
    @vendor_info = params

    params = { 'Request' => http_request }

    client = Savon::Client.new(wsdl: 'https://api.mindbodyonline.com/0_5/ClassService.asmx?wsdl')

    response = client.call(:get_classes, :message => params )

    @classes_list = response.body[:get_classes_response][:get_classes_result][:classes][:class]
    @vendor_id = site_ids['int']

    render 'schedules/index.json'
  end

  def create
    print params[:id]
    site_ids = { 'int' => -99 }
    source_credentials = {
      'SourceName' => 'FitorMiss',
      'Password' => 'KsrvE/bc9IOl/4lKi7o1nbQwDoQ=',
      'SiteIDs' => site_ids
    }
    user_credentials = {
      'Username' => 'Siteowner',
      'Password' => 'apitest1234',
      'SiteIDs' => site_ids
    }

    http_request = {
      'SourceCredentials' => source_credentials,
      'UserCredentials' => user_credentials,
      'ClientIDs' => { 'int' => 1000 },
      'ClassIDs' => { 'int' => params[:id] },
    }

    params = { 'Request' => http_request }

    client = Savon::Client.new(wsdl: 'https://api.mindbodyonline.com/0_5/ClassService.asmx?wsdl')

    response = client.call(:add_clients_to_classes, :message => params);

    render nil
  end

end
