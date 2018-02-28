class UserNotifier < ActionMailer::Base
  default :from => 'FitOrMiss@example.com'

  def send_signup_email(email, first_name)
    @email = email
    @first_name = first_name
    mail( :to => @email,
    :subject => 'Welcome to Fit or Miss!' )
  end
end
