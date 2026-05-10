class LessonsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_course, only: [ :index, :create ]
  before_action :set_lesson, only: [ :show, :update, :destroy ]
  before_action :authorize_ownership!, only: [:update, :destroy]

  def index
    render json: @course.lessons
  end

  def show
    render json: @lesson.as_json(include: { course: { only: [:creator_id] }})
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
    @lesson = Lesson.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Aula não encontrada" }, status: :not_found
  end

  def lesson_params
    params.require(:lesson).permit(:title, :status, :video_url, :content)
  end

  def authorize_ownership!
    unless current_user == @lesson.course.creator
        render json: { error: "Não autorizado" }, status: :forbidden
    end
  end
end
