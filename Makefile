.PHONY: install dev build clean docker-up docker-down

# Установка зависимостей
install:
	cd backend && npm install
	cd frontend && npm install

# Запуск в режиме разработки
dev:
	make docker-up
	cd backend && npm run start:dev &
	cd frontend && npm run dev

# Сборка проекта
build:
	cd backend && npm run build
	cd frontend && npm run build

# Очистка
clean:
	cd backend && rm -rf node_modules dist
	cd frontend && rm -rf node_modules .nuxt .output dist

# Docker
docker-up:
	docker-compose up -d postgres redis

docker-down:
	docker-compose down

# Логи
logs-backend:
	cd backend && npm run start:dev

logs-frontend:
	cd frontend && npm run dev
