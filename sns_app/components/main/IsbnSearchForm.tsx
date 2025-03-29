'use client';

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validationSearchSchemaIsbn } from "app/utils/validationSchema";

type IsbnSearchFormProps = {
  setSearchForm: (data: any) => void;
  searchBooks: (data: any) => void;
};

type SearchFormOfIsbn = {
  isbn: string;
}

const IsbnSearchForm: React.FC<IsbnSearchFormProps> = ({ setSearchForm, searchBooks }) => {

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SearchFormOfIsbn>({
    mode: "onChange",
    resolver: zodResolver(validationSearchSchemaIsbn),
  });

  const setForm = (data: SearchFormOfIsbn) => {
    setSearchForm(data);
    searchBooks(data);
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(setForm)}>
      <label className="flex items-center py-1 text-xs md:text-sm" htmlFor="isbn">
        ISBN
        <span className="px-2.5 ml-2 rounded-full bg-red-100 font-medium text-xss text-red-800">必須</span>
        </label>
      <input
        id="isbn"
        type="text"
        className="max-w-40 p-1 pl-2 text-xs md:text-sm border focus:outline-primary-400"
        {...register("isbn")}
      />
      <p className="p-1 text-xss text-red-500">{errors.isbn?.message as React.ReactNode}</p>
      <button
        className="mt-2 py-1 px-3 text-xs md:text-sm rounded-md bg-primary-400 text-white hover:bg-primary-500 disabled:bg-primary-200"
        type="submit"
        disabled={!isValid}
      >
        検索
      </button>
    </form>
  );
};

export default IsbnSearchForm;
