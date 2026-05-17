export type Category = {
  id: string;
  title: string;
  count: number;
  description: string;
};

export type Subcategory = {
  id: string;
  title: string;
  categoryId: string;
};

// Верхний уровень — 4 категории для главной страницы
export const categories: Category[] = [
  {
    id: "vehicles",
    title: "Электровелосипеды и самокаты",
    count: 0,
    description: "Готов к работе и поездкам",
  },
  {
    id: "batteries",
    title: "Аккумуляторы",
    count: 0,
    description: "Готовые батареи и ячейки для сборки",
  },
  {
    id: "parts",
    title: "Запчасти",
    count: 0,
    description: "Восстановление, ремонт, апгрейд",
  },
  {
    id: "assembly",
    title: "Сборка батарей",
    count: 0,
    description: "BMS, сварка, инструменты для DIY",
  },
];

// Нижний уровень — подкатегории внутри каталога
export const subcategories: Subcategory[] = [
  // → vehicles
  { id: "electric-bikes", title: "Электровелосипеды", categoryId: "vehicles" },
  { id: "scooters", title: "Электросамокаты", categoryId: "vehicles" },

  // → batteries
  { id: "bike-batteries", title: "Готовые батареи для велосипедов", categoryId: "batteries" },
  { id: "cells", title: "Ячейки 18650/21700/Lifepo4", categoryId: "batteries" },

  // → parts
  { id: "bike-spare-parts", title: "Запчасти для электровелосипедов", categoryId: "parts" },
  { id: "u2-premium-parts", title: "Запчасти на U2 PREMIUM", categoryId: "parts" },
  { id: "accessories", title: "Аксессуары (шлемы, очки, сумки)", categoryId: "parts" },

  // → assembly
  { id: "bms", title: "BMS и расходники", categoryId: "assembly" },
  { id: "welding-tools", title: "Точечная сварка и инструменты", categoryId: "assembly" },
  { id: "services", title: "Услуги (сборка, диагностика)", categoryId: "assembly" },
];