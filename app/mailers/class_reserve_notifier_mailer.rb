class ClassReserveNotifierMailer < ApplicationMailer
  default :from => 'FitOrMiss@example.com'

  def send_reservation_email(user_info, res_info)
    @user_info = user_info
    @res_info = res_info
    print user_info, res_info
    mail( :to => @user_info[:email],
    :subject => "You're all set!" )
  end

  def vendor_reservation_email(user_info, res_info)
    @user_info = user_info
    @res_info = res_info
    print user_info, res_info
    mail( :to => @res_info[:email],
    :subject => "New reservation for #{@res_info[:name]} class!" )
  end
end
