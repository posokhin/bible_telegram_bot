import { Context } from "telegraf";

export const setCommands = (ctx: Context, next: () => void) => {
  const commands = [{ command: "start", description: "Запустить бота" }];
  ctx.telegram.setMyCommands(commands);
  next();
};
