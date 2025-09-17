#!/bin/bash

echo "--- Iniciando configuração da aplicação ---"

# Aplicar migrações do banco de dados
echo "1. Aplicando migrações do banco de dados..."
python manage.py migrate

# Criar um superusuário padrão (admin/adminpassword) de forma não-interativa
echo "2. Criando superusuário padrão (admin / adminpassword)..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword') if not User.objects.filter(username='admin').exists() else print('Superusuário \"admin\" já existe.')" | python manage.py shell

echo ""
echo "--- Configuração concluída com sucesso! ---"
echo "Para rodar a aplicação, siga as instruções que estarão no README.md."
