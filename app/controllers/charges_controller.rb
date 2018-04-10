class ChargesController < ApplicationController

  def create
    Stripe.api_key = ENV['STRIPE_SK']
    amount = (params[:thisClass][:price] + '00').to_i

    print amount
    # charge = Stripe::Charge.create(
    #   :currency => 'usd',
    #   :amount => (params[:thisClass][:price] + '00').to_i,
    #   :customer => params[:customer]
    # )
    render json: ["Success"];
  end

end
