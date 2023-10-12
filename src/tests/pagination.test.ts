import { Pagination } from "../utils/Pagination";

test("initialize", () => {
  const p = new Pagination({ perPage: 50, size: 125 });
  expect(p.currentPage).toEqual(1);
  expect(p.start).toEqual(0);
  expect(p.end).toEqual(50);
  expect(p.pages).toEqual(3);
});

test("next method", () => {
  const p = new Pagination({ perPage: 50, size: 125 });

  p.next();
  expect(p.currentPage).toEqual(2);
  expect(p.start).toEqual(50);
  expect(p.end).toEqual(100);

  p.next();
  expect(p.currentPage).toEqual(3);
  expect(p.start).toEqual(100);
  expect(p.end).toEqual(150);
});

test("prev method", () => {
  const p = new Pagination({ perPage: 50, size: 125 });

  p.next();
  p.prev();
  expect(p.currentPage).toEqual(1);
  expect(p.start).toEqual(0);
  expect(p.end).toEqual(50);
});
