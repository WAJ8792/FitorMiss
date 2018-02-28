class ReservationsController < ApplicationController

  def create
    @user_info = params[:userInfo]
    @res_info = params[:resInfo]
    ClassReserveNotifierMailer.send_reservation_email(@user_info, @res_info).deliver_now
    ClassReserveNotifierMailer.vendor_reservation_email(@user_info, @res_info).deliver_now

    render json: ["Message sent"]
  end

end
