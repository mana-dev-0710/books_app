'use client';

import { UserIcon, ArrowRightEndOnRectangleIcon, HeartIcon, PlusCircleIcon, StarIcon, Bars3Icon, PencilSquareIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, CheckCircleIcon, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import React from 'react';
import { JSX } from 'react';

type IconName =
    'register' |
    'login' |
    'addBookshelf' |
    'isInBookshelf' |
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
    addBookshelf: <PlusCircleIcon />,
    isInBookshelf: <CheckCircleIcon />,
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
