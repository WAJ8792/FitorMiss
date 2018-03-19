require "#{Rails.application.root}/lib/mind_body_api.rb"

MindBody.configuration.source_name = "FitorMiss" # from MindBody Developer Account (free)
MindBody.configuration.source_key = "KsrvE/bc9IOl/4lKi7o1nbQwDoQ=" # from MindBody Developer Account
MindBody.configuration.site_ids = [-99] # array of Site IDs - or just 1
