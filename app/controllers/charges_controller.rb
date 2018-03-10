class ChargesController < ApplicationController

  def create
    Stripe.api_key = 'sk_live_NQMgf5d4lCIhb6Dpnpyc9H0v'

    charge = Stripe::Charge.create(
      :currency => 'usd',
      :amount => params[:amount],
      :customer => params[:customer]
    )
    print charge
  end

end
