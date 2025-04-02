'use client';

type TitleProps = {
    titleName: string;
};

const Title = ({ titleName = "タイトル" }: TitleProps) => {

    return (
        <>
            <h2 className="py-2 text-sm md:text-base font-semibold">{titleName}</h2>
        </>
    );

};

export default Title;