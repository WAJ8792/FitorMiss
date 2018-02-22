class UsersController < ApplicationController

  def create
    print "We made it to the controller!"
    @email = params[:email]
    UserNotifier.send_signup_email(@email).deliver_now

    render json: ["Message sent"]
  end

end
