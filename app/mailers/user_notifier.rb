class UserNotifier < ActionMailer::Base
  default :from => 'FitOrMiss@example.com'

  def send_signup_email(email)
    @email = email
    mail( :to => @email,
    :subject => 'Thanks for signing up for our amazing app' )
  end
end
