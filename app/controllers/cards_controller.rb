class CardsController < ApplicationController

  def create
    customer = Stripe::Customer.create(
      :email => params[:name],
      :source  => params[:token][:id]
    )
    render json: customer
  end

end
