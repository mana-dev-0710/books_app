'use client';

import { UserIcon, ArrowRightEndOnRectangleIcon, HeartIcon, BookOpenIcon, StarIcon, Bars3Icon, PencilSquareIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookOpenIcon as BookOpenIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import React from 'react';
import { JSX } from 'react';

type IconName =
    'register' |
    'login' |
    'finishedReading' |
    'finishedReadingSolid' |
    'favorite' |
    'favoriteSolid' |
    'rating' |
    'ratingSolid' |
    'hamburger' |
    'edit' |
    'menu';

type IconsProps = {
    name: IconName;
    className?: string;
    onClick?: () => void;
};

const iconMap: Record<IconName, JSX.Element> = {
    register: <UserIcon />,
    login: <ArrowRightEndOnRectangleIcon />,
    favorite: <HeartIcon />,
    favoriteSolid: <HeartIconSolid />,
    finishedReading: <BookOpenIcon />,
    finishedReadingSolid: <BookOpenIconSolid />,
    rating: <StarIcon />,
    ratingSolid: <StarIconSolid />,
    hamburger: <Bars3Icon />,
    edit: <PencilSquareIcon />,
    menu: <EllipsisVerticalIcon />,
};

const Icons = ({ name, className = '', onClick }: IconsProps) => {
    const Icon = iconMap[name];
    const combinedClassName = `inline-block size-6 ${className}`;

    return (
        <div className={combinedClassName} onClick={onClick}>
            {Icon}
        </div>
    );
};

export default Icons;
