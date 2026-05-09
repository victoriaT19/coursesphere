class EnrollmentsController < ApplicationController
  before_action :authenticate_user!

  def create
    course = Course.find(params[:id])
    enrollment = current_user.enrollments.build(course: course)

    if enrollment.save
      render json: {message: "Inscrição realizada com sucesso!"}, status: :created
    else
      render json: {error: enrollment.errors.full_messages.first}, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: {error: "Curso não encontrado"}, status: :not_found
  end

  def destroy
    enrollment = current_user.enrollments.find_by(course_id: params[:id])

    if enrollment
      enrollment.destroy
      render json: {message: "Incrição cancelada com sucesso!"}
    else
      render json: {error: "Inscrição não encontrada"}, status: :not_found
    end
  end
end