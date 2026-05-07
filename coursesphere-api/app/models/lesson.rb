class Lesson < ApplicationRecord
  belongs_to :course

  validates :title, presence: true, length: { minimum: 3 }
  validates :status, presence: true, inclusion:  { in: %w[draft published] }
  validates :video_url, format: { with: URI.regexp(%w[http https]), message: "não parece uma URL válida" }, allow_blank: true
end
