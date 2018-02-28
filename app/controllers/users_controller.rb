class UsersController < ApplicationController

  def create
    @email = params[:email]
    @first_name = params[:firstName]
    UserNotifier.send_signup_email(@email, @first_name).deliver_now

    render json: ["Message sent"]
  end

end
