import { Pagination } from "../utils/Pagination";

export type UserMap = {
  [key: number]: {
    userId: number;
    currentBook: {
      name: string;
      rName: string;
    } | null;
    currentChapter: number | null;
    pagination: Pagination;
  };
};
