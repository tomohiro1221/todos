
json.array!(@todos) do |todo|
  json.extract! todo, :id, :text
  json.url todo_url(todo, format: :json)
end
