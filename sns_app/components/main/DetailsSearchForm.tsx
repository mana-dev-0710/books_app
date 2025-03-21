'use client';

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validationSearchSchemaDetails } from "app/utils/validationSchema";

type DetailsSearchFormProps = {
    setSearchForm: (data: any) => void;
};

type SearchFormOfDetails = {
    title?: string;
    author?: string;
    publisher?: string;
}

const DetailsSearchForm: React.FC<DetailsSearchFormProps> = ({ setSearchForm }) => {

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<SearchFormOfDetails>({
        mode: "onChange",
        resolver: zodResolver(validationSearchSchemaDetails),
    });

    const setForm = (data: SearchFormOfDetails) => {
        setSearchForm(data);
    };

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(setForm)}>
            <label className="flex items-center py-1 text-xs md:text-sm" htmlFor="title">
                タイトル
                <span className="px-2.5 ml-2 rounded-full bg-yellow-100 font-medium text-xss text-yellow-800">
                    １項目以上の入力必須
                </span>
            </label>
            <input
                id="title"
                type="text"
                className="w-full max-w-[488px] p-1 pl-2 text-xs md:text-sm border focus:outline-primary-400"
                {...register("title")}
            />
            <p className="p-1 text-xss text-red-500">{errors.title?.message as React.ReactNode}</p>
            <label className="flex items-center py-1 text-xs md:text-sm" htmlFor="author">
                作者
                <span className="px-2.5 ml-2 rounded-full bg-yellow-100 font-medium text-xss text-yellow-800">
                    １項目以上の入力必須
                </span>
            </label>
            <input
                id="author"
                type="text"
                className="w-full max-w-[488px] p-1 pl-2 text-xs md:text-sm border focus:outline-primary-400"
                {...register("author")}
            />
            <p className="p-1 text-xss text-red-500">{errors.author?.message as React.ReactNode}</p>
            <label className="flex items-center py-1 text-xs md:text-sm" htmlFor="publisher">
                出版社
                <span className="px-2.5 ml-2 rounded-full bg-yellow-100 font-medium text-xss text-yellow-800">
                    １項目以上の入力必須
                </span>
            </label>
            <input
                id="publisher"
                type="text"
                className="w-full max-w-[488px] p-1 pl-2 text-xs md:text-sm border focus:outline-primary-400"
                {...register("publisher")}
            />
            <p className="p-1 text-xss text-red-500">{errors.publisher?.message as React.ReactNode}</p>
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

export default DetailsSearchForm;
