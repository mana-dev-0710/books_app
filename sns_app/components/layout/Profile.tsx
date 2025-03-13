'use client';

import { useSession } from "next-auth/react";
import Image from "next/image";
import Icons from "components/icons/Icons";

type ProfileProp = {
    className: string;
    imageClassName: string;
};

const defaultProfileImage = '/images/default-profile.png';

const Profile = ({ className, imageClassName }: ProfileProp) => {

    const { data: session, status } = useSession();

    return (
        <div className={`${className}`}>
            <div className="basis-1/3 flex flex-col items-center">
                <Image
                    src={session?.user?.image || defaultProfileImage}
                    alt={"NEWTアプリ画面イメージ"}
                    width={80}
                    height={80}
                    priority
                    className={`${imageClassName}`}
                />
                <div className="mt-2 text-center text-sm sm:text-base font-semibold">
                    {session?.user?.name}
                </div>
            </div>
            <div className="basis-2/3 relative p-2">
                <ul className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <li className="col-span-2 mt-1">読書冊数：
                        <p className="inline-block text-sm sm:text-base lg:text-sm font-bold">50</p> 冊
                    </li>
                    <li className="col-span-2">読書ページ数：
                        <p className="inline-block text-sm sm:text-base lg:text-sm font-bold">3,000</p> p
                    </li>
                    <li className="col-span-2">評価冊数：
                        <p className="inline-block text-sm sm:text-base lg:text-sm font-bold">50</p> 冊
                    </li>
                </ul>
                <div className="absolute right-0 bottom-0">
                    <Icons
                        name="edit"
                        className="text-gray-600"
                    // TODO:編集画面
                    // onClick={() => }
                    />
                </div>
            </div>
        </div>
    );
}

export default Profile;
