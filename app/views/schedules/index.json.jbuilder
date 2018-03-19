 @classes_list.each do |thisClass|
  id = thisClass[:id] + '_' + thisClass[:class_description][:id]
  class_description = thisClass[:class_description]
  json.set! id do
      json.extract! class_description, :name
  end
end
