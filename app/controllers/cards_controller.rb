class CardsController < ApplicationController

  def create
    Stripe.api_key = ENV['STRIPE_SK']

    customer = Stripe::Customer.create(
      :email => params[:name],
      :source  => params[:token][:id]
    )
    render json: customer
  end

end
