class User < ApplicationRecord
  has_secure_password
  has_many :created_courses, class_name: "Course", foreign_key: "creator_id"

  has_many :enrollments
  has_many :enrolled_courses, through: :enrollments, source: :course

  enum :role, { student: 0, instructor: 1, admin: 2 }

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }, uniqueness: true
end
