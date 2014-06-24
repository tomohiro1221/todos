class CreateTodos < ActiveRecord::Migration
  def change
    create_table :todos do |t|
      t.name :string

      t.timestamps
    end
  end
end
