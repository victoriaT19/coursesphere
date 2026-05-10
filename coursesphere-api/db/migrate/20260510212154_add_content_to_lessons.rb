class AddContentToLessons < ActiveRecord::Migration[8.1]
  def change
    add_column :lessons, :content, :text
  end
end
