import { Context, Markup } from "telegraf";
import { UserMap } from "../types/UserMap";
import { Update } from "telegraf/typings/core/types/typegram";
import {
  chooseBookReply,
  generatePaginationKeyboard,
  showChapters,
} from "../utils";
import { Pagination } from "../utils/Pagination";

test("chooseBookReply", () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const ctx: Context<Update.MessageUpdate> = {
    reply: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    update: { message: { from: { id: 1 } } },
  };
  const books = [{ name: "Genesis", rName: "Бытие" }];
  const usersMap: UserMap = {};

  chooseBookReply({ ctx, usersMap, books });

  expect(ctx.reply).toHaveBeenCalledWith(
    "Выберете книгу",
    Markup.keyboard(
      books.map((i) => i.rName),
      {
        columns: 2,
      },
    ),
  );
});

test("showChapters", () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const ctx: Context<Update> = { reply: jest.fn() };
  ctx.reply = jest.fn();

  const book = {
    name: "Genesis",
    abbrev: "gn",
    chapters: [
      ["chapter"],
      ["chapter"],
      ["chapter"],
      ["chapter"],
      ["chapter"],
      ["chapter"],
      ["chapter"],
      ["chapter"],
      ["chapter"],
    ],
  };

  const pagination = new Pagination({ perPage: 3, size: 9 });

  const buttons = ["Вернуться к выбору книги"].concat(
    book.chapters
      .map((_chapter, index) => `${index + 1}`)
      .slice(pagination.start, pagination.end),
    generatePaginationKeyboard(pagination),
  );

  showChapters(ctx, book, pagination);

  expect(ctx.reply).toHaveBeenCalledWith(
    "Выберете главу",
    Markup.keyboard(buttons, {
      columns: 3,
    }),
  );
});

test("generatePaginationKeyboard", () => {
  const pagination = new Pagination({ perPage: 50, size: 150 });

  expect(generatePaginationKeyboard(pagination).length).toEqual(1);
  expect(generatePaginationKeyboard(pagination)[0]).toEqual("Далее");

  pagination.next();

  expect(generatePaginationKeyboard(pagination).length).toEqual(2);
  expect(generatePaginationKeyboard(pagination)[0]).toEqual("Назад");
  expect(generatePaginationKeyboard(pagination)[1]).toEqual("Далее");

  pagination.next();

  expect(generatePaginationKeyboard(pagination).length).toEqual(1);
  expect(generatePaginationKeyboard(pagination)[0]).toEqual("Назад");

  pagination.next();

  expect(generatePaginationKeyboard(pagination).length).toEqual(1);
  expect(generatePaginationKeyboard(pagination)[0]).toEqual("Назад");
});
