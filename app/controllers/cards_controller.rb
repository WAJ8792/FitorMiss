class CardsController < ApplicationController

  def create
    customer = Stripe::Customer.create(
      :email => params[:name],
      :source  => params[:token][:id]
    )
    print customer
  end

end
