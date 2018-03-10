class ChargesController < ApplicationController

  def create
    Stripe.api_key = ENV['secret_key']

    charge = Stripe::Charge.create(
      :currency => 'usd',
      :amount => params[:amount],
      :customer => params[:customer]
    )
    print charge
  end

end
