class ApplicationController < ActionController::Base
  # protect_from_forgery with: :exception
  def getRequestParams(site_id)
    site_id = { 'int' => site_id }
    source_credentials = {
      'SourceName' => 'FitorMiss',
      'Password' => 'KsrvE/bc9IOl/4lKi7o1nbQwDoQ=',
      'SiteIDs' => site_id
    }
    user_credentials = {
      'Username' => '_FitorMiss',
      'Password' => 'KsrvE/bc9IOl/4lKi7o1nbQwDoQ=',
      'SiteIDs' => site_id,
    }

    http_request = {
      'SourceCredentials' => source_credentials,
      'UserCredentials' => user_credentials,
    }

    return http_request
  end
end
