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

    params = { 'Request' => http_request }

    client = Savon::Client.new(wsdl: 'https://api.mindbodyonline.com/0_5/ClassService.asmx?wsdl')

    response = client.call(:get_classes, :message => params )

    @classes_list = response.body[:get_classes_response][:get_classes_result][:classes][:class]
    # @id

    render 'schedules/index.json'
  end

end
