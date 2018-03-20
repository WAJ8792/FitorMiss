 json.array! @classes_list do |thisClass|
  id = 'midbody_' + thisClass[:class_description][:id]
  class_description = thisClass[:class_description]

  json.id id
  json.canceled thisClass[:is_canceled]
  json.vendor_id @vendor_id
  json.name thisClass[:class_description][:name]
  json.max_capacity thisClass[:max_capacity]
  json.total_booked thisClass[:total_booked]
  json.web_capacity thisClass[:web_capacity]
  json.web_booked thisClass[:web_booked]
  json.start_date_time thisClass[:start_date_time]
  json.end_date_time thisClass[:end_date_time]

end
