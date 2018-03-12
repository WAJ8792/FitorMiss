class CardsController < ApplicationController

  def create
    Stripe.api_key = ENV['STRIPE_SK']
    print ENV['STRIPE_SK']

    print params[:name], params[:token]
    customer = Stripe::Customer.create(
      :email => params[:name],
      :source  => params[:token][:id]
    )
    render json: customer
  end

end
