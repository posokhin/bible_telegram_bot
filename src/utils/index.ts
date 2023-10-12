import { Context, Markup } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { Pagination } from "./Pagination";
import { UserMap } from "../types/UserMap";
import { BibleBook } from "../types/Bible";

interface ChooseBookReplyOptions {
  ctx: Context<Update.MessageUpdate>;
  usersMap: UserMap;
  books: { name: string; rName: string }[];
}

export const chooseBookReply = ({
  ctx,
  usersMap,
  books,
}: ChooseBookReplyOptions) => {
  const userId = ctx.update.message.from.id;

  usersMap[userId] = {
    currentBook: null,
    currentChapter: null,
    pagination: new Pagination({ perPage: 50, size: 0 }),
    userId,
  };

  return ctx.reply(
    "Выберете книгу",
    Markup.keyboard(
      books.map((i) => i.rName),
      {
        columns: 2,
      },
    ),
  );
};

export const generatePaginationKeyboard = (
  pagination: Pagination,
): string[] => {
  const buttons: string[] = [];

  if (pagination.currentPage > 1) {
    buttons.push("Назад");
  }

  if (pagination.currentPage < pagination.pages) {
    buttons.push("Далее");
  }

  return buttons;
};

export const showChapters = (
  ctx: Context,
  book: BibleBook,
  pagination: Pagination,
) => {
  const buttons = ["Вернуться к выбору книги"].concat(
    book.chapters
      .map((_chapter, index) => `${index + 1}`)
      .slice(pagination.start, pagination.end),
    generatePaginationKeyboard(pagination),
  );

  return ctx.reply(
    "Выберете главу",
    Markup.keyboard(buttons, {
      columns: 3,
    }),
  );
};
