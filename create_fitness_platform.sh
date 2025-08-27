#!/bin/bash

# Скрипт для создания структуры фитнес-платформы
# Запуск: bash create_kamelot_platform.sh

echo "🏗️  Создание структуры фитнес-платформы..."

# Создание корневой директории проекта
mkdir -p kamelot-platform
cd kamelot-platform

echo "📁 Создание Frontend структуры (Nuxt 3)..."

# Frontend структура
mkdir -p frontend/{assets/{css,images},components/{ui,schedule,profile,blog,trainers},pages/{schedule,profile,blog/{category},trainers,auth},layouts,middleware,plugins,stores,utils,public}

# Frontend файлы
touch frontend/nuxt.config.ts
touch frontend/package.json
touch frontend/app.vue
touch frontend/README.md
touch frontend/.gitignore
touch frontend/.env.example

# Assets
touch frontend/assets/css/main.css

# Components - UI
touch frontend/components/ui/AppHeader.vue
touch frontend/components/ui/AppFooter.vue
touch frontend/components/ui/AppNavigation.vue
touch frontend/components/ui/AppSidebar.vue

# Components - Schedule
touch frontend/components/schedule/ScheduleCalendar.vue
touch frontend/components/schedule/WorkoutCard.vue
touch frontend/components/schedule/TrainerCard.vue
touch frontend/components/schedule/ScheduleFilter.vue

# Components - Profile
touch frontend/components/profile/ProfileForm.vue
touch frontend/components/profile/ProfileStats.vue
touch frontend/components/profile/WorkoutHistory.vue
touch frontend/components/profile/ProgressChart.vue

# Components - Blog
touch frontend/components/blog/BlogCard.vue
touch frontend/components/blog/BlogList.vue
touch frontend/components/blog/BlogFilter.vue
touch frontend/components/blog/BlogSearch.vue

# Components - Trainers
touch frontend/components/trainers/TrainerProfile.vue
touch frontend/components/trainers/TrainerList.vue
touch frontend/components/trainers/TrainerFilter.vue
touch frontend/components/trainers/TrainerBooking.vue

# Pages
touch frontend/pages/index.vue

# Pages - Schedule
touch frontend/pages/schedule/index.vue
touch frontend/pages/schedule/[id].vue

# Pages - Profile
touch frontend/pages/profile/index.vue
touch frontend/pages/profile/settings.vue
touch frontend/pages/profile/history.vue

# Pages - Blog
touch frontend/pages/blog/index.vue
touch frontend/pages/blog/[slug].vue
touch frontend/pages/blog/category/[category].vue

# Pages - Trainers
touch frontend/pages/trainers/index.vue
touch frontend/pages/trainers/[id].vue

# Pages - Auth
touch frontend/pages/auth/login.vue
touch frontend/pages/auth/register.vue

# Layouts
touch frontend/layouts/default.vue
touch frontend/layouts/auth.vue

# Middleware
touch frontend/middleware/auth.js
touch frontend/middleware/guest.js

# Plugins
touch frontend/plugins/api.client.js

# Stores
touch frontend/stores/auth.js
touch frontend/stores/schedule.js
touch frontend/stores/profile.js
touch frontend/stores/blog.js
touch frontend/stores/trainers.js

# Utils
touch frontend/utils/api.js
touch frontend/utils/date.js
touch frontend/utils/validation.js

echo "🔧 Создание Backend структуры (NestJS)..."

# Backend структура
mkdir -p backend/src/{modules/{auth/{dto,entities,guards,strategies},users/{dto,entities},schedule/{dto,entities},workouts/{dto,entities},trainers/{dto,entities},blog/{dto,entities},bookings/{dto,entities},file-upload},common/{decorators,filters,guards,interceptors,pipes,types},config,database/{migrations,seeds}}
mkdir -p backend/{test,dist}

# Backend корневые файлы
touch backend/package.json
touch backend/tsconfig.json
touch backend/tsconfig.build.json
touch backend/nest-cli.json
touch backend/.env.example
touch backend/.gitignore
touch backend/README.md

# Основные файлы приложения
touch backend/src/main.ts
touch backend/src/app.module.ts
touch backend/src/app.controller.ts
touch backend/src/app.service.ts

# Auth Module
touch backend/src/modules/auth/auth.module.ts
touch backend/src/modules/auth/auth.controller.ts
touch backend/src/modules/auth/auth.service.ts
touch backend/src/modules/auth/dto/login.dto.ts
touch backend/src/modules/auth/dto/register.dto.ts
touch backend/src/modules/auth/entities/user.entity.ts
touch backend/src/modules/auth/guards/jwt-auth.guard.ts
touch backend/src/modules/auth/guards/roles.guard.ts
touch backend/src/modules/auth/strategies/jwt.strategy.ts
touch backend/src/modules/auth/strategies/local.strategy.ts

# Users Module
touch backend/src/modules/users/users.module.ts
touch backend/src/modules/users/users.controller.ts
touch backend/src/modules/users/users.service.ts
touch backend/src/modules/users/dto/create-user.dto.ts
touch backend/src/modules/users/dto/update-user.dto.ts
touch backend/src/modules/users/entities/user.entity.ts

# Schedule Module
touch backend/src/modules/schedule/schedule.module.ts
touch backend/src/modules/schedule/schedule.controller.ts
touch backend/src/modules/schedule/schedule.service.ts
touch backend/src/modules/schedule/dto/create-schedule.dto.ts
touch backend/src/modules/schedule/dto/update-schedule.dto.ts
touch backend/src/modules/schedule/dto/schedule-filter.dto.ts
touch backend/src/modules/schedule/entities/schedule-item.entity.ts

# Workouts Module
touch backend/src/modules/workouts/workouts.module.ts
touch backend/src/modules/workouts/workouts.controller.ts
touch backend/src/modules/workouts/workouts.service.ts
touch backend/src/modules/workouts/dto/create-workout.dto.ts
touch backend/src/modules/workouts/dto/update-workout.dto.ts
touch backend/src/modules/workouts/entities/workout.entity.ts

# Trainers Module
touch backend/src/modules/trainers/trainers.module.ts
touch backend/src/modules/trainers/trainers.controller.ts
touch backend/src/modules/trainers/trainers.service.ts
touch backend/src/modules/trainers/dto/create-trainer.dto.ts
touch backend/src/modules/trainers/dto/update-trainer.dto.ts
touch backend/src/modules/trainers/entities/trainer.entity.ts

# Blog Module
touch backend/src/modules/blog/blog.module.ts
touch backend/src/modules/blog/blog.controller.ts
touch backend/src/modules/blog/blog.service.ts
touch backend/src/modules/blog/dto/create-blog-post.dto.ts
touch backend/src/modules/blog/dto/update-blog-post.dto.ts
touch backend/src/modules/blog/dto/blog-filter.dto.ts
touch backend/src/modules/blog/entities/blog-post.entity.ts

# Bookings Module
touch backend/src/modules/bookings/bookings.module.ts
touch backend/src/modules/bookings/bookings.controller.ts
touch backend/src/modules/bookings/bookings.service.ts
touch backend/src/modules/bookings/dto/create-booking.dto.ts
touch backend/src/modules/bookings/dto/update-booking.dto.ts
touch backend/src/modules/bookings/entities/booking.entity.ts

# File Upload Module
touch backend/src/modules/file-upload/file-upload.module.ts
touch backend/src/modules/file-upload/file-upload.controller.ts
touch backend/src/modules/file-upload/file-upload.service.ts

# Common
touch backend/src/common/decorators/roles.decorator.ts
touch backend/src/common/decorators/current-user.decorator.ts
touch backend/src/common/filters/http-exception.filter.ts
touch backend/src/common/guards/roles.guard.ts
touch backend/src/common/interceptors/transform.interceptor.ts
touch backend/src/common/interceptors/logging.interceptor.ts
touch backend/src/common/pipes/validation.pipe.ts
touch backend/src/common/types/index.ts

# Config
touch backend/src/config/database.config.ts
touch backend/src/config/jwt.config.ts
touch backend/src/config/app.config.ts

# Database
touch backend/src/database/migrations/.gitkeep
touch backend/src/database/seeds/.gitkeep

# Test
touch backend/test/app.e2e-spec.ts
touch backend/test/jest-e2e.json

echo "📄 Создание конфигурационных файлов..."

# Frontend package.json
cat > frontend/package.json << 'EOF'
{
  "name": "kamelot-platform-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "generate": "nuxt generate",
    "postinstall": "nuxt prepare"
  },
  "devDependencies": {
    "@nuxt/devtools": "latest",
    "nuxt": "^3.12.0"
  },
  "dependencies": {
    "@nuxt/ui": "^2.18.0",
    "@pinia/nuxt": "^0.5.0",
    "@vueuse/nuxt": "^10.0.0",
    "pinia": "^2.1.0"
  }
}
EOF

# Frontend .env.example
cat > frontend/.env.example << 'EOF'
# API Configuration
API_BASE_URL=http://localhost:3001/api

# App Configuration
NUXT_PUBLIC_APP_NAME=kamelot Platform
NUXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# Frontend .gitignore
cat > frontend/.gitignore << 'EOF'
# Nuxt dev/build outputs
.output
.nuxt
.nitro
.cache
dist

# Node dependencies
node_modules

# IDE
.vscode
.idea

# OS
.DS_Store
Thumbs.db

# Env files
.env
.env.local
.env.*.local

# Logs
*.log
EOF

# Backend package.json
cat > backend/package.json << 'EOF'
{
  "name": "kamelot-platform-backend",
  "version": "1.0.0",
  "description": "Backend for kamelot platform",
  "author": "",
  "private": true,
  "license": "MIT",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/serve-static": "^4.0.0",
    "bcryptjs": "^2.4.3",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "pg": "^8.8.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "typeorm": "^0.3.17",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/bcryptjs": "^2.4.2",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/multer": "^1.4.7",
    "@types/node": "^20.3.1",
    "@types/passport-jwt": "^3.0.9",
    "@types/passport-local": "^1.0.35",
    "@types/pg": "^8.6.6",
    "@types/supertest": "^2.0.12",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.1",
    "typescript": "^5.1.3"
  }
}
EOF

# Backend .env.example
cat > backend/.env.example << 'EOF'
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=kamelot_user
DATABASE_PASSWORD=kamelot_password
DATABASE_NAME=kamelot_platform

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# App
PORT=3001
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
EOF

# Backend .gitignore
cat > backend/.gitignore << 'EOF'
# Compiled output
/dist
/node_modules

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variables file
.env
.env.local
.env.*.local

# Uploads
/uploads
EOF

# Backend tsconfig.json
cat > backend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
EOF

# Backend nest-cli.json
cat > backend/nest-cli.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
EOF

echo "📋 Создание дополнительных файлов..."

# Создание корневого README.md
cat > README.md << 'EOF'
# Фитнес-платформа

Современная фитнес-платформа с расписанием тренировок, личным кабинетом и блогом.

## Технологии
- **Frontend**: Nuxt 3 + NuxtUI + Tailwind CSS
- **Backend**: NestJS + TypeORM + PostgreSQL

## Структура проекта
- `frontend/` - Клиентская часть (Nuxt 3)
- `backend/` - Серверная часть (NestJS)

## Установка и запуск

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Основные модули
- 🏃‍♂️ **Расписание** - календарь тренировок и запись
- 👤 **Личный кабинет** - профиль, история, статистика
- 📝 **Блог** - статьи о фитнесе и здоровье
- 💪 **Тренеры** - каталог тренеров и запись к ним

## API Документация
После запуска backend доступна по адресу: http://localhost:3001/api/docs
EOF

# Создание docker-compose.yml для разработки
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: kamelot_postgres
    environment:
      POSTGRES_DB: kamelot_platform
      POSTGRES_USER: kamelot_user
      POSTGRES_PASSWORD: kamelot_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - kamelot_network

  redis:
    image: redis:7-alpine
    container_name: kamelot_redis
    ports:
      - "6379:6379"
    networks:
      - kamelot_network

volumes:
  postgres_data:

networks:
  kamelot_network:
    driver: bridge
EOF

# Создание основного .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
.output/
.nuxt/

# Logs
*.log
logs/

# Database
*.sqlite
*.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Uploads
uploads/
EOF

# Создание Makefile для удобства
cat > Makefile << 'EOF'
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
EOF

echo "✅ Структура проекта создана успешно!"
echo ""
echo "📁 Создана следующая структура:"
echo "   kamelot-platform/"
echo "   ├── frontend/          # Nuxt 3 приложение"
echo "   ├── backend/           # NestJS API"
echo "   ├── docker-compose.yml # PostgreSQL + Redis"
echo "   ├── Makefile          # Команды для разработки"
echo "   └── README.md         # Документация"
echo ""
echo "🚀 Следующие шаги:"
echo "   1. cd kamelot-platform"
echo "   2. make install        # Установить зависимости"
echo "   3. make docker-up      # Запустить базы данных"
echo "   4. make dev           # Запустить в режиме разработки"
echo ""
echo "🌐 После запуска:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   API Docs: http://localhost:3001/api/docs"