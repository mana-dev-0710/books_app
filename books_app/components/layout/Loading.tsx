'use client';

type LoadingProp = {
    className: string;
};

const Loading = ({ className }: LoadingProp) => {

    return (
        <div className={`${className}`} aria-label="読み込み中">
            <div className="animate-spin h-10 w-10 border-4 border-secondary-500 rounded-full border-t-transparent"></div>
        </div>
    );


}

export default Loading;