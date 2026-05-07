class AuthController < ApplicationController
  def register
    @user = User.new(user_params)
    if @user.save
      token = generate_token(@user)
      render json: { token: token, user: { id: @user.id, name: @user.name, email: @user.email } }, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def login
    @user = User.find_by(email: params[:email])
    if @user&.authenticate(params[:password])
      token = generate_token(@user)
      render json: { token: token,  user: { id: @user.id, name: @user.name, email: @user.email } }
    else
      render json: { error: "Email ou senha inválidos" }, status: :unauthorized
    end
  end

  private

  def generate_token(user)
    JWT.encode({ user_id: user.id, exp: 24.hours.from_now.to_i }, Rails.application.secret_key_base, "HS256")
  end
  def user_params
    params.permit(:name, :email, :password)
  end
end
