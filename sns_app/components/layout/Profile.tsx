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
            <div className="flex flex-col items-center">
                <Image
                    src={session?.user?.image || defaultProfileImage}
                    alt={"NEWTアプリ画面イメージ"}
                    width={80}
                    height={80}
                    priority
                    className={`${imageClassName}`}
                />
                <div className="mt-1 text-center text-sm font-semibold">
                    {session?.user?.name}
                </div>
            </div>
            <div className="relative p-2 ml-5 lg:ml-0">
                <ul className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <li className="col-span-2 mt-1">読書冊数：
                        <p className="inline-block text-sm lg:text-xs font-bold">XX</p> 冊
                    </li>
                    <li className="col-span-2">読書ページ数：
                        <p className="inline-block text-sm lg:text-xs font-bold">X,XXX</p> p
                    </li>
                    <li className="col-span-2">評価冊数：
                        <p className="inline-block text-sm lg:text-xs font-bold">XX</p> 冊
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Profile;
