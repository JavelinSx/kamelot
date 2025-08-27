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
