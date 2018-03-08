class ChargesController < ApplicationController

  def create
    print params[:amount], params[:customer]

    charge = Stripe::Charge.create(
      :currency => 'usd',
      :amount => params[:amount],
      :customer => params[:customer]
    )
    print charge
  end

end
