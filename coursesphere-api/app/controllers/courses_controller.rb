class CoursesController < ApplicationController
    before_action :authenticate_user!
    before_action :set_course, only: [ :show, :update, :destroy ]
    before_action :authorize_ownership!, only: [ :update, :destroy ]

    def index
        @courses = Course.all
        render json: @courses
    end

    def show
        render json: @course.as_json(include: :lessons)
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
end
