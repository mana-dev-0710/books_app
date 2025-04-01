export type SearchForm = {
    isbn?: string;
    title?: string;
    author?: string;
    publisher?: string;
};

export type BookshelfEditForm = {
    bookshelfId: string;
    finishedReading: boolean;
    readingStatus: string;
    finishedAt?: string | null;
    isRated: boolean;
    reviewTitle?: string | null;
    rating?: string | null;
    reviewContent?: string | null;
}