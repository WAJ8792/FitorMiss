 json.array! @classes_list do |thisClass|
  id = 'mindbody_' + thisClass[:class_description][:id]
  class_description = thisClass[:class_description]

  json.id id
  json.amenities @vendor_info["amenities"]
  json.canceled thisClass[:is_canceled]
  json.vendor_id @vendor_id
  json.vendor @vendor_info["gym_name"]
  json.neighborhood @vendor_info["neighborhood"]
  json.neighborhood_id @vendor_info["neighborhoodId"]
  json.description thisClass[:class_description][:description]
  json.name thisClass[:class_description][:name]
  json.booking do
    json.maxCapacity thisClass[:max_capacity]
    json.totalBooked thisClass[:total_booked]
    json.webCapacity thisClass[:web_capacity]
    json.webBooked thisClass[:web_booked]
  end
  json.start_date_time thisClass[:start_date_time]
  json.end_date_time thisClass[:end_date_time]

end
