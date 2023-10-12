type PaginationOptions = {
  perPage: number;
  size: number;
};

export class Pagination {
  perPage: number;
  currentPage = 1;
  pages: number;
  size: number;
  start = 0;
  end: number;

  constructor({ perPage, size }: PaginationOptions) {
    this.perPage = perPage;
    this.size = size;
    this.pages = Math.ceil(this.size / this.perPage);
    this.end = this.perPage;
  }

  next(): void {
    if (this.currentPage >= this.pages) return;
    this.currentPage += 1;
    this.start += this.perPage;
    this.end += this.perPage;
  }

  prev(): void {
    this.currentPage -= 1;
    this.start -= this.perPage;
    this.end -= this.perPage;
  }
}
