require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module FitOrMiss
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

      file_path = File.join(Rails.root, 'config', 'secrets.yml')
      config_keys = HashWithIndifferentAccess.new(YAML::load(IO.read(file_path)))[Rails.env]
      config_keys.each do |k,v|
        ENV[k.upcase] ||= v
      end

  end
end
