export type Book = {
    isbn: string;
    title?: string;
    volume?: string;
    author?: string;
    publisher?: string;
    publicationDate?: string;
    genre?: string;
    jpeCode?: string;
    imgUrl?: string;
    isFavorite: boolean;
    isInBookshelf: boolean;
    finishedAt?: Date | null;
    rated: boolean;
    rating?: number | null;
    reviewTitle? : string | null;
    reviewContent? : string | null;
};

export type SearchForm = {
    isbn?: string;
    title?: string;
    author?: string;
    publisher?: string;
};
