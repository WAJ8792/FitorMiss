class ApplicationController < ActionController::Base
  # protect_from_forgery with: :exception
  def getRequestParams
    site_ids = { 'int' => ['35233', '-99'] }
    source_credentials = {
      'SourceName' => 'FitorMiss',
      'Password' => 'KsrvE/bc9IOl/4lKi7o1nbQwDoQ=',
      'SiteIDs' => site_ids
    }
    user_credentials = {
      'Username' => '_FitorMiss',
      'Password' => 'KsrvE/bc9IOl/4lKi7o1nbQwDoQ=',
      'SiteIDs' => site_ids,
      'LocationID' => "2"
    }

    http_request = {
      'SourceCredentials' => source_credentials,
      'UserCredentials' => user_credentials
    }

    return http_request
  end

end
