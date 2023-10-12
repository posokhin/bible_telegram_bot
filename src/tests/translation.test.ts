import { bookNames } from "../utils/translation";

test("show translation for Genesis - Бытие", () => {
  expect(bookNames["Genesis"]).toEqual("Бытие");
});
