class LessonsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_course
  before_action :set_lesson, only: [ :show, :update, :destroy ]

  def index
    render json: @course.lessons
  end

  def show
    render json: @lesson
  end

  def create
    @lesson = @course.lessons.build(lesson_params)
    if @lesson.save
      render json: @lesson, status: :created
    else
      render json: @lesson.errors, status: :unprocessable_entity
    end
  end

  def update
    if @lesson.update(lesson_params)
      render json: @lesson
    else
      render json: @lesson.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @lesson.destroy
    head :no_content
  end

  private

  def set_course
    @course = Course.find(params[:course_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Curso não encontrado" }, status: :not_found
  end

  def set_lesson
    @lesson = @course.lessons.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Aula não encontrada" }, status: :not_found
  end

  def lesson_params
    params.require(:lesson).permit(:title, :status, :video_url)
  end
end
