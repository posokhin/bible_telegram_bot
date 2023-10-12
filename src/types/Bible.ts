export type Bible = BibleBook[];

export type BibleBook = {
  abbrev: string;
  chapters: BibleChapter[];
  name: string;
};

export type BibleChapter = string[];
