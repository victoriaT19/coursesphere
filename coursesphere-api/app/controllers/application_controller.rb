class ApplicationController < ActionController::API
    private

    def authenticate_user!
      token = request.headers["Authorization"]&.split(" ")&.last
      payload = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: "HS256")[0]
      @current_user = User.find(payload["user_id"])
    rescue => e
        render json: { error: "Usuário não autorizado" }, status: :unauthorized
    end

    def current_user
      @current_user
    end
end
