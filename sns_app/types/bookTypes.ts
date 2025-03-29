export type BaseBook = {
    isbn: string;
    title?: string;
    volume?: string;
    author?: string;
    publisher?: string;
    publicationDate?: string;
    genre?: string;
    jpeCode?: string;
    imgUrl?: string;
};

export type SearchedBook = BaseBook & {
    isFavorite: boolean;
    isInBookshelf: boolean;
};

export type MyBook = BaseBook & {
    bookshelfId: string;
    isFavorite: boolean;
    finishedReading: boolean;
    finishedAt?: string | null;
    rated: boolean;
    rating?: number | null;
    reviewTitle? : string | null;
    reviewContent? : string | null;
};

export type FavoriteBook = BaseBook & {
    favoriteBookId: string;
    isInBookshelf: boolean;
};

