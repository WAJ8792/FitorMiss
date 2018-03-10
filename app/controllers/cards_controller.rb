class CardsController < ApplicationController

  def create
    Stripe.api_key = ENV['secret_key']

    customer = Stripe::Customer.create(
      :email => params[:name],
      :source  => params[:token][:id]
    )
    render json: customer
  end

end
