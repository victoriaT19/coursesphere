# Usuários
user1 = User.find_or_create_by(email: "teste@email.com") do |u|
    u.name = "Teste"
    u.password = "123456"
end

user2 = User.find_or_create_by(email: "t3@email.com") do |u|
    u.name = "t3"
    u.password = "234567"
end

# Cursos
course1 = Course.find_or_create_by(name: "Introdução ao Ruby", creator: user1) do |c|
    c.description = "Aprenda Ruby do zero com exemplos práticos."
    c.start_date = "2026-05-10"
    c.end_date = "2026-06-10"
end

course2 = Course.find_or_create_by(name: "React para Iniciantes", creator: user1) do |c|
    c.description = "Construa interfaces modernas com React."
    c.start_date = "2026-06-01"
    c.end_date = "2026-07-01"
end

# Aulas
Lesson.find_or_create_by(title: "O que é Ruby?", course: course1) do |l|
    l.status = "published"
    l.video_url = "https://www.youtube.com/watch?v=F_cQSB3l0W0"
    l.content = "Ruby é uma linguagem de programação dinâmica e de código aberto com foco na simplicidade e produtividade."
end

Lesson.find_or_create_by(title: "Variáveis e Tipos", course: course1) do |l|
    l.status = "published"
    l.content = "Em Ruby, variáveis são declaradas sem tipo explícito. Exemplos: nome = 'Ruby', versao = 3.2"
end

Lesson.find_or_create_by(title: "Rascunho: Classes e Objetos", course: course1) do |l|
    l.status = "draft"
    l.content = "Conteúdo em construção..."
end

Lesson.find_or_create_by(title: "Introdução ao React", course: course2) do |l|
    l.status = "published"
    l.content = "React é uma biblioteca JavaScript para construção de interfaces de usuário criada pelo Facebook."
end

puts "Seed concluído!"
puts "Usuário 1: teste@email.com / 123456"
puts "Usuário 2: t3@email.com / 234567"