class CoursesController < ApplicationController
    before_action :authenticate_user!
    before_action :set_course, only: [ :show, :update, :destroy ]
    before_action :authorize_ownership!, only: [ :update, :destroy ]

    def index
        @courses = Course.order(order_clause(params[:sort]))
        @courses = @courses.where("name ILIKE ?", "%#{params[:search]}%") if params[:search].present?
        page = (params[:page] || 1).to_i
        per_page = 5
        total = @courses.count
        @courses = @courses.offset((page-1) * per_page).limit(per_page)
        render json: { 
            courses: @courses.map {|c| c.as_json.merge(lessons_count: current_user.id == c.creator_id ? c.lessons.count : c.lessons.where(status: "published").count)},
            total: total,
            page: page,
            per_page: per_page,
            total_pages: (total.to_f/per_page).ceil
        }
    end

    def show
        enrolled = current_user.enrollments.exists?(course_id: @course.id)
        render json: @course.as_json(
            include:{
                lessons: {},
                creator: {only: [:id, :name]}
            }
        ).merge(enrolled: enrolled, enrolled_count: @course.enrollments.count)
    end

    def create
        @course = current_user.created_courses.build(course_params)

        if @course.save
            render json: @course, status: :created
        else
            render json: @course.errors, status: :unprocessable_entity
        end
    end

    def update
        if @course.update(course_params)
            render json: @course
        else
            render json: @course.errors, status: :unprocessable_entity
        end
    end

    def destroy
        @course.destroy
        head :no_content
    end

    private

    def set_course
        @course = Course.find(params[:id])
    rescue ActiveRecord::RecordNotFound
        render json: { error: "Course not found" }, status: :not_found
    end

    def authorize_ownership!
        unless current_user == @course.creator || current_user.admin?
            render json: { error: "Not Authorized: Voce não é o criador desse curso" }, status: :forbidden
        end
    end

    def course_params
        params.require(:course).permit(:name, :description, :start_date, :end_date)
    end

    def order_clause(sort)
      case sort
        when "name" then "name ASC"
        when "name_desc" then "name DESC"
        when "oldest" then "created_at ASC"
        else "created_at DESC"
      end
    end
end
