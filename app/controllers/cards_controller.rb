class CardsController < ApplicationController

  def create
    Stripe.api_key = 'sk_live_NQMgf5d4lCIhb6Dpnpyc9H0v'

    customer = Stripe::Customer.create(
      :email => params[:name],
      :source  => params[:token][:id]
    )
    render json: customer
  end

end
