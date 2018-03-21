# def self.fetch_mindbody_schedule()
#     message = {
#       'HideCanceledClasses' => true
#     }
#     res = ClassService.get_classes(message)
#     classes = res.result[:classes]
#     classes.sort!{|a,b| a.start_date_time <=> b.start_date_time}
#     return classes
# end
