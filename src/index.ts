import { config } from "dotenv";
import { Telegraf } from "telegraf";
import bibleJson from "./ru_synodal.json";
import { Bible } from "./types/Bible";
import { Pagination } from "./utils/Pagination";
import { bookNames } from "./utils/translation";
import { UserMap } from "./types/UserMap";
import { chooseBookReply, showChapters } from "./utils";
import { setCommands } from "./middlewares/commands";

config();

if (process.env.BOT_TOKEN) {
  const adminId = 197485401;

  const bot = new Telegraf(process.env.BOT_TOKEN);
  const bible = bibleJson as Bible;
  const books = bible.map((i) => ({ name: i.name, rName: bookNames[i.name] }));

  const usersMap: UserMap = {};

  bot.use(setCommands);

  books.forEach((book) => {
    bot.hears(book.rName, (ctx) => {
      let userData = usersMap[ctx.update.message.from.id];
      let userId = userData?.userId;
      if (!userId) {
        userId = ctx.update.message.from.id;
        usersMap[userId] = {
          userId,
          currentBook: book,
          currentChapter: null,
          pagination: new Pagination({ perPage: 50, size: 0 }),
        };
        userData = usersMap[userId];
      }

      if (!userData.currentBook) {
        userData.currentBook = book;
      }

      const founded = bible.find((i) => i.name === userData.currentBook?.name);

      if (founded) {
        userData.pagination = new Pagination({
          perPage: 50,
          size: founded.chapters.length,
        });

        showChapters(ctx, founded, userData.pagination);
      }
    });

    bot.hears(/^\d+$/, async (ctx) => {
      try {
        const chapterNumber = ctx.match[0];
        const userId = usersMap[ctx.update.message.from.id]?.userId;

        if (userId) {
          const currentBook = usersMap[userId].currentBook?.name;

          if (chapterNumber && currentBook) {
            const userData = usersMap[userId];
            userData.currentChapter = +chapterNumber;

            if (userData.currentChapter) {
              const founded = bible.find((i) => i.name === currentBook);

              if (founded) {
                const text = founded.chapters[
                  userData.currentChapter - 1
                ].reduce(
                  (acc, i, index) =>
                    `${acc}${index !== 0 ? " " : ""}${index + 1}.${i}`,
                  "",
                );

                const maxTextSize = 4096;

                if (text.length >= maxTextSize) {
                  let start = 0;
                  let end = Math.ceil(maxTextSize / 2);
                  const messages: string[] = [];
                  let parts = Math.ceil(text.length / (maxTextSize / 2));

                  while (parts > 0) {
                    messages.push(text.slice(start, end));
                    parts -= 1;
                    start = end;
                    end += Math.ceil(maxTextSize / 2);
                  }

                  for (let i = 0; i < messages.length; i++) {
                    await ctx.reply(messages[i]);
                  }
                } else {
                  return ctx.reply(text);
                }
              }
            }
          }
        } else {
          chooseBookReply({ ctx, usersMap, books });
        }
      } catch (e) {
        ctx.reply("Произошла непредвиденная ошибка. Уже бегу все чинить!");
      }
    });
  });

  bot.hears("Вернуться к выбору книги", (ctx) =>
    chooseBookReply({ ctx, usersMap, books }),
  );

  bot.hears("Далее", (ctx) => {
    const userData = usersMap[ctx.update.message.from.id];
    userData.pagination.next();
    const currentBook = userData.currentBook;

    if (currentBook) {
      const founded = bible.find((i) => i.name === currentBook.name);

      if (founded) {
        showChapters(ctx, founded, userData.pagination);
      }
    }
  });

  bot.hears("Назад", (ctx) => {
    const userData = usersMap[ctx.update.message.from.id];
    userData.pagination.prev();
    const currentBook = userData.currentBook;

    if (currentBook) {
      const founded = bible.find((i) => i.name === currentBook?.name);

      if (founded) {
        showChapters(ctx, founded, userData.pagination);
      }
    }
  });

  bot.hears("/show_stats", (ctx) => {
    if (ctx.update.message.from.id === adminId) {
      const keysOfUsersMap = Object.keys(usersMap);
      const message = `Количество пользователей запустивших бота после последнего запуска бота: ${keysOfUsersMap.length}`;
      return ctx.reply(message);
    }
  });

  bot.start((ctx) => {
    chooseBookReply({ ctx, usersMap, books });
  });

  bot.launch();

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
