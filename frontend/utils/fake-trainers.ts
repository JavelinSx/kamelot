// utils/fake-trainers.ts
import artem from "~/assets/images/trainer/artem.jpg";
import ismail from "~/assets/images/trainer/ismail.jpg";
import koval from "~/assets/images/trainer/koval.jpg";
import skripnik from "~/assets/images/trainer/skripnik.jpg";
import type { Trainer, User, WorkoutType } from "~/types";

// Создаем базовых пользователей
const createTrainerUser = (
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  avatar: string,
  patronymic?: string
): User => ({
  id,
  firstName,
  lastName,
  email,
  phone,
  avatar,
  role: "trainer",
  dateOfBirth: "1990-01-01",
  gender: "male",
  createdAt: "2020-01-01T00:00:00Z",
  updatedAt: "2024-12-01T00:00:00Z",
});

export const FAKE_TRAINERS: Trainer[] = [
  {
    id: 1,
    user: createTrainerUser(
      101,
      "Павел",
      "Коваль",
      "koval@kamelot.com",
      "+7 (495) 123-45-01",
      koval,
      "Антонович"
    ),
    specialization: ["mma", "wrestling", "grappling"] as WorkoutType[],
    experience: 10,
    rating: 4.9,
    reviewsCount: 156,
    isActive: true,
    bio: "Мастер спорта по панкратиону, вольной борьбе и СБИ ММА. Финалист чемпионата России по СБИ ММА. Главный тренер сборной Санкт-Петербурга и сборной России по панкратиону 2018г. Судья международной категории.",
    achievements: [
      "МС по панкратиону",
      "МС по вольной борьбе",
      "МС по СБИ ММА (Федерация Ориентал)",
      "Финалист чемпионата России по СБИ ММА",
      "КМС по грэпплингу",
      "Чемпион Санкт-Петербурга по грэпплингу",
      "Главный тренер сборной Санкт-Петербурга и сборной России по панкратиону 2018г",
      "Судья международной категории по спортивной борьбе и грэпплингу",
      "Судья Чемпионатов России, Европы и мира",
      "Опыт работы тренером более 10 лет",
      "Ученики Чемпионы России, Европы и Мира по разным видам единоборств",
      "Профессиональные бойцы выступающие в топовых лигах России",
    ],
    certifications: [
      "Сертифицированный тренер по ММА",
      "Судья международной категории по борьбе",
      "Инструктор по грэпплингу",
      "Тренер по панкратиону высшей категории",
    ],
    schedule: {
      monday: [
        { start: "09:00", end: "11:00", type: "wrestling" as WorkoutType },
        { start: "18:00", end: "20:00", type: "mma" as WorkoutType },
      ],
      tuesday: [
        { start: "10:00", end: "12:00", type: "grappling" as WorkoutType },
        { start: "19:00", end: "21:00", type: "mma" as WorkoutType },
      ],
      wednesday: [
        { start: "09:00", end: "11:00", type: "wrestling" as WorkoutType },
        { start: "18:00", end: "20:00", type: "grappling" as WorkoutType },
      ],
      thursday: [
        { start: "10:00", end: "12:00", type: "mma" as WorkoutType },
        { start: "19:00", end: "21:00", type: "wrestling" as WorkoutType },
      ],
      friday: [
        { start: "09:00", end: "11:00", type: "grappling" as WorkoutType },
        { start: "18:00", end: "20:00", type: "mma" as WorkoutType },
      ],
      saturday: [
        { start: "11:00", end: "13:00", type: "wrestling" as WorkoutType },
        { start: "15:00", end: "17:00", type: "mma" as WorkoutType },
      ],
      sunday: [],
    },
    price: 4500,
    stats: {
      totalStudents: 120,
      sessionsCompleted: 1547,
      averageRating: 4.9,
      yearsExperience: 10,
    },
  },

  {
    id: 2,
    user: createTrainerUser(
      102,
      "Артем",
      "Владимирович",
      "artem@kamelot.com",
      "+7 (495) 123-45-02",
      artem
    ),
    specialization: ["kickboxing", "grappling", "mma"] as WorkoutType[],
    experience: 8,
    rating: 4.8,
    reviewsCount: 94,
    isActive: true,
    bio: "КМС по тайскому боксу. Чемпион Кубка Консула по тайскому боксу. КМС по грэпплингу, призер и победитель региональных и всероссийских турниров по грэпплингу. Победитель всероссийских и региональных турниров по панкратиону, ММА и Боевому самбо.",
    achievements: [
      "КМС по тайскому боксу",
      "Чемпион Кубка Консула по тайскому боксу",
      "КМС по грэпплингу призер и победитель региональных и всероссийский турниров по грэпплингу",
      "Победитель всероссийских и региональных турниров по панкратиону, ММА и Боевому самбо",
    ],
    certifications: [
      "Сертифицированный тренер по тайскому боксу",
      "Тренер по грэпплингу",
      "Инструктор по ММА",
      "Специалист по боевому самбо",
    ],
    schedule: {
      monday: [
        { start: "10:00", end: "12:00", type: "kickboxing" as WorkoutType },
        { start: "17:00", end: "19:00", type: "grappling" as WorkoutType },
      ],
      tuesday: [
        { start: "09:00", end: "11:00", type: "mma" as WorkoutType },
        { start: "18:00", end: "20:00", type: "kickboxing" as WorkoutType },
      ],
      wednesday: [
        { start: "10:00", end: "12:00", type: "grappling" as WorkoutType },
        { start: "17:00", end: "19:00", type: "kickboxing" as WorkoutType },
      ],
      thursday: [
        { start: "09:00", end: "11:00", type: "kickboxing" as WorkoutType },
        { start: "18:00", end: "20:00", type: "mma" as WorkoutType },
      ],
      friday: [
        { start: "10:00", end: "12:00", type: "grappling" as WorkoutType },
      ],
      saturday: [
        { start: "12:00", end: "14:00", type: "kickboxing" as WorkoutType },
        { start: "15:00", end: "17:00", type: "mma" as WorkoutType },
      ],
      sunday: [
        { start: "11:00", end: "13:00", type: "grappling" as WorkoutType },
      ],
    },
    price: 3800,
    stats: {
      totalStudents: 75,
      sessionsCompleted: 856,
      averageRating: 4.8,
      yearsExperience: 8,
    },
  },

  {
    id: 3,
    user: createTrainerUser(
      103,
      "Роял",
      "Исмаилов",
      "ismail@kamelot.com",
      "+7 (495) 123-45-03",
      ismail,
      "Сахиб Оглы"
    ),
    specialization: ["kickboxing", "mma"] as WorkoutType[],
    experience: 9,
    rating: 4.8,
    reviewsCount: 143,
    isActive: true,
    bio: "Мастер спорта по кикбоксингу. Чемпион России по К-1. Обладатель кубка России по кэмп мма. Образование: НГУ им П.Ф. Лесгафта, кафедра бокса, факультет единоборств. Тренерский стаж с 2015 года. Профессиональная школа фитнеса Д. Атлетикс.",
    achievements: [
      "Мастер спорта по кикбоксингу",
      "Чемпион России по К-1",
      "Обладатель кубка России по кэмп мма",
      "Образование: НГУ им П.Ф. Лесгафта, кафедра бокса, факультет единоборств",
      "Тренерский стаж с 2015 года",
      "Профессиональная школа фитнеса Д. Атлетикс",
    ],
    certifications: [
      "Диплом НГУ им. П.Ф. Лесгафта",
      "Сертифицированный тренер по кикбоксингу",
      "Инструктор по ММА",
      "Специалист по спортивной подготовке",
    ],
    schedule: {
      monday: [
        { start: "08:00", end: "10:00", type: "kickboxing" as WorkoutType },
        { start: "15:00", end: "17:00", type: "mma" as WorkoutType },
        { start: "19:00", end: "21:00", type: "kickboxing" as WorkoutType },
      ],
      tuesday: [
        { start: "08:00", end: "10:00", type: "mma" as WorkoutType },
        { start: "16:00", end: "18:00", type: "kickboxing" as WorkoutType },
      ],
      wednesday: [
        { start: "08:00", end: "10:00", type: "kickboxing" as WorkoutType },
        { start: "15:00", end: "17:00", type: "mma" as WorkoutType },
        { start: "19:00", end: "21:00", type: "kickboxing" as WorkoutType },
      ],
      thursday: [
        { start: "08:00", end: "10:00", type: "mma" as WorkoutType },
        { start: "16:00", end: "18:00", type: "kickboxing" as WorkoutType },
      ],
      friday: [
        { start: "08:00", end: "10:00", type: "kickboxing" as WorkoutType },
        { start: "15:00", end: "17:00", type: "mma" as WorkoutType },
      ],
      saturday: [
        { start: "10:00", end: "12:00", type: "kickboxing" as WorkoutType },
        { start: "14:00", end: "16:00", type: "mma" as WorkoutType },
      ],
      sunday: [],
    },
    price: 4200,
    stats: {
      totalStudents: 95,
      sessionsCompleted: 1286,
      averageRating: 4.8,
      yearsExperience: 9,
    },
  },

  {
    id: 4,
    user: createTrainerUser(
      104,
      "Александр",
      "Скрипник",
      "skripnik@kamelot.com",
      "+7 (495) 123-45-04",
      skripnik,
      "Анатольевич"
    ),
    specialization: ["grappling", "mma"] as WorkoutType[],
    experience: 7,
    rating: 4.7,
    reviewsCount: 89,
    isActive: true,
    bio: "КМС по панкратиону. Призер Чемпионата Санкт-Петербурга по панкратиону. Призер Всероссийских турниров по панкратиону. КМС по грэпплингу. Чемпион СЗФО по грэпплингу. Победитель боя по ММА в матчевой встрече Россия - Беларусь. Призер и победитель региональных и международных турниров по ММА, Панкратиону и грэпплингу.",
    achievements: [
      "КМС по панкратиону",
      "Призер Чемпионата Санкт-Петербурга по панкратиону",
      "Призер Всероссийских турниров по панкратиону",
      "КМС по грэпплингу",
      "Чемпион СЗФО по грэпплингу",
      "Победитель боя по ММА в матчевой встрече Россия - Беларусь",
      "Призер и победитель региональных и международных турниров по ММА, Панкратиону и грэпплингу",
    ],
    certifications: [
      "Сертифицированный тренер по грэпплингу",
      "Инструктор по панкратиону",
      "Тренер по ММА",
      "Специалист по спортивной борьбе",
    ],
    schedule: {
      monday: [
        { start: "11:00", end: "13:00", type: "grappling" as WorkoutType },
        { start: "17:00", end: "19:00", type: "mma" as WorkoutType },
      ],
      tuesday: [
        { start: "10:00", end: "12:00", type: "mma" as WorkoutType },
        { start: "18:00", end: "20:00", type: "grappling" as WorkoutType },
      ],
      wednesday: [
        { start: "11:00", end: "13:00", type: "grappling" as WorkoutType },
        { start: "17:00", end: "19:00", type: "mma" as WorkoutType },
      ],
      thursday: [
        { start: "10:00", end: "12:00", type: "mma" as WorkoutType },
        { start: "18:00", end: "20:00", type: "grappling" as WorkoutType },
      ],
      friday: [
        { start: "11:00", end: "13:00", type: "grappling" as WorkoutType },
      ],
      saturday: [
        { start: "13:00", end: "15:00", type: "mma" as WorkoutType },
        { start: "16:00", end: "18:00", type: "grappling" as WorkoutType },
      ],
      sunday: [
        { start: "12:00", end: "14:00", type: "grappling" as WorkoutType },
      ],
    },
    price: 3600,
    stats: {
      totalStudents: 58,
      sessionsCompleted: 723,
      averageRating: 4.7,
      yearsExperience: 7,
    },
  },
];

// Утилитарные функции для работы с тренерами
export const getTrainersBySpecialization = (
  specialization: WorkoutType
): Trainer[] => {
  return FAKE_TRAINERS.filter((trainer) =>
    trainer.specialization.includes(specialization)
  );
};

export const getActiveTrainers = (): Trainer[] => {
  return FAKE_TRAINERS.filter((trainer) => trainer.isActive);
};

export const getTrainerById = (id: number): Trainer | undefined => {
  return FAKE_TRAINERS.find((trainer) => trainer.id === id);
};

export const getTopRatedTrainers = (limit: number = 3): Trainer[] => {
  return FAKE_TRAINERS.sort((a, b) => b.rating - a.rating).slice(0, limit);
};

export const searchTrainers = (query: string): Trainer[] => {
  const searchTerm = query.toLowerCase();
  return FAKE_TRAINERS.filter(
    (trainer) =>
      trainer.user.firstName.toLowerCase().includes(searchTerm) ||
      trainer.user.lastName.toLowerCase().includes(searchTerm) ||
      trainer.bio?.toLowerCase().includes(searchTerm) ||
      trainer.specialization.some((spec) =>
        spec.toLowerCase().includes(searchTerm)
      )
  );
};
