class ProfileController < ApplicationController
    before_action :authenticate_user!

    def show
      render json:{
        user: {
          id: current_user.id,
          name: current_user.name,
          email: current_user.email,
          created_at: current_user.created_at
        },
        created_courses: current_user.created_courses.map{
          |c| c.as_json.merge(lessons_count: c.lessons.count)
        },
        enrolled_courses: current_user.enrolled_courses.map{
          |c| c.as_json.merge(lessons_count: c.lessons.where(status: "published").count)
        }
      }
    end
end 