class ChargesController < ApplicationController

  def create
    charge = Stripe::Charge.create(
      :currency => 'usd',
      :amount => params[:amount],
      :customer => params[:customer]
    )
    print charge
  end

end
