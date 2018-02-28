class UsersController < ApplicationController

  def create
    print "We made it to the controller!"
    @email = params[:email]
    @first_name = params[:firstName]
    print @first_name
    UserNotifier.send_signup_email(@email, @first_name).deliver_now

    render json: ["Message sent"]
  end

end
