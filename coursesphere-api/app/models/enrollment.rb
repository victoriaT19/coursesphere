class Enrollment < ApplicationRecord
  belongs_to :user
  belongs_to :course

  validates :user_id, uniqueness: {scope: :course_id, message: "Já está inscrito neste curso"}
end