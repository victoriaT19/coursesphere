class CreateCourses < ActiveRecord::Migration[8.1]
  def change
    create_table :courses do |t|
      t.string :name
      t.text :description
      t.date :start_date
      t.date :end_date
      t.references :creator, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
