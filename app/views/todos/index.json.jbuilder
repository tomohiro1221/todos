json.array!(@todos) do |todo|
  json.extract! todo, :id, :string
  json.url todo_url(todo, format: :json)
end
