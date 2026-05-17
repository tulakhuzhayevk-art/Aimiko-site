const product = {
    name: "product",
    title: "Товар",
    type: "document",
    fields: [
      {
        name: "name",
        title: "Название",
        type: "string",
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: "slug",
        title: "URL (slug)",
        type: "slug",
        options: { source: "name", maxLength: 96 },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: "category",
        title: "Категория (отображение)",
        type: "string",
      },
      {
        name: "categoryId",
        title: "Категория (главная)",
        type: "string",
        options: {
          list: [
            { title: "Электровелосипеды и самокаты", value: "vehicles" },
            { title: "Аккумуляторы", value: "batteries" },
            { title: "Запчасти", value: "parts" },
            { title: "Сборка батарей", value: "assembly" },
          ],
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: "subcategoryId",
        title: "Подкатегория",
        type: "string",
        options: {
          list: [
            // → Электровелосипеды и самокаты
            { title: "Электровелосипеды", value: "electric-bikes" },
            { title: "Электросамокаты", value: "scooters" },
            // → Аккумуляторы
            { title: "Готовые батареи для велосипедов", value: "bike-batteries" },
            { title: "Ячейки 18650/21700/Lifepo4", value: "cells" },
            // → Запчасти
            { title: "Запчасти для электровелосипедов", value: "bike-spare-parts" },
            { title: "Запчасти на U2 PREMIUM", value: "u2-premium-parts" },
            { title: "Аксессуары (шлемы, очки, сумки)", value: "accessories" },
            // → Сборка батарей
            { title: "BMS и расходники", value: "bms" },
            { title: "Точечная сварка и инструменты", value: "welding-tools" },
            { title: "Услуги (сборка, диагностика)", value: "services" },
          ],
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: "description",
        title: "Описание",
        type: "text",
      },
      {
        name: "price",
        title: "Розничная цена",
        type: "string",
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: "oldPrice",
        title: "Старая цена (если есть скидка)",
        type: "string",
      },
      {
        name: "wholesalePrice",
        title: "Оптовая цена",
        type: "string",
      },
      {
        name: "status",
        title: "Наличие",
        type: "string",
        options: {
          list: [
            { title: "В наличии", value: "В наличии" },
            { title: "Под заказ", value: "Под заказ" },
            { title: "Нет в наличии", value: "Нет в наличии" },
          ],
        },
        initialValue: "В наличии",
      },
      {
        name: "specs",
        title: "Характеристики",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              { name: "label", title: "Параметр", type: "string" },
              { name: "value", title: "Значение", type: "string" },
            ],
          },
        ],
      },
      {
        name: "shortSpecs",
        title: "Короткие характеристики (для карточки)",
        type: "array",
        of: [{ type: "string" }],
      },
      {
        name: "images",
        title: "Фотографии",
        type: "array",
        of: [{ type: "image", options: { hotspot: true } }],
      },
      {
        name: "isPopular",
        title: "Популярный товар",
        type: "boolean",
        initialValue: false,
      },
      {
        name: "isNew",
        title: "Новинка",
        type: "boolean",
        initialValue: false,
      },
    ],
  };
  const service = {
    name: "service",
    title: "Услуга",
    type: "document",
    fields: [
      {
        name: "name",
        title: "Название услуги",
        type: "string",
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: "slug",
        title: "URL (slug)",
        type: "slug",
        options: { source: "name", maxLength: 96 },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: "shortDescription",
        title: "Краткое описание (для карточки)",
        type: "text",
        rows: 2,
        description: "1-2 предложения. Видно сразу в списке услуг.",
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: "description",
        title: "Полное описание",
        type: "text",
        rows: 5,
        description: "Подробно: что делаешь, что клиент получит.",
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: "price",
        title: "Стоимость",
        type: "string",
        description: 'Например: "От 1 000 ₽", "Индивидуально", "5 000 ₽"',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: "duration",
        title: "Срок выполнения",
        type: "string",
        description: 'Например: "1–3 дня", "В день обращения"',
      },
      {
        name: "warranty",
        title: "Гарантия",
        type: "string",
        description: 'Например: "6 месяцев", "30 дней", "Без гарантии"',
      },
      {
        name: "location",
        title: "Где выполняется",
        type: "string",
        initialValue: "Москва, ул. Вернисажная, 13 (м. Локомотив)",
      },
      {
        name: "includes",
        title: "Что входит в услугу",
        type: "array",
        of: [{ type: "string" }],
        description: "Список пунктов: что именно делаешь.",
      },
      {
        name: "details",
        title: "Подробности (цены/условия)",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              { name: "label", title: "Параметр", type: "string" },
              { name: "value", title: "Значение", type: "string" },
            ],
          },
        ],
        description: 'Пары "Параметр — Значение"',
      },
      {
        name: "images",
        title: "Фотографии",
        type: "array",
        of: [{ type: "image", options: { hotspot: true } }],
      },
      {
        name: "isPopular",
        title: "Показывать на главной",
        type: "boolean",
        initialValue: false,
      },
    ],
    preview: {
      select: {
        title: "name",
        subtitle: "price",
        media: "images.0",
      },
    },
  };

  export const schemaTypes = [product, service];