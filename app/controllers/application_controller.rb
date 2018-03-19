class ApplicationController < ActionController::Base
  include ActionController::ImplicitRender
  protect_from_forgery with: :exception
end
