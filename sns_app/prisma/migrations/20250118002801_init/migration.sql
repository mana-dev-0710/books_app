-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(32) NOT NULL,
    `user_name` VARCHAR(16) NOT NULL,
    `name` VARCHAR(16) NOT NULL,
    `gender` INTEGER NOT NULL,
    `age` INTEGER NOT NULL,
    `birth` DATETIME(3) NOT NULL,
    `email` VARCHAR(300) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `profile` VARCHAR(191) NULL,
    `profile_image` VARCHAR(191) NULL,
    `header_image` VARCHAR(191) NULL,
    `link` VARCHAR(191) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `users_user_id_key`(`user_id`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
