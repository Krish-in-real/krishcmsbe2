-- CreateTable
CREATE TABLE `Account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `hashedPassword` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Account_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `memberId` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `hashedPassword` VARCHAR(255) NOT NULL,
    `userRole` ENUM('member', 'coordinator', 'evaluator', 'advisor', 'administrator') NOT NULL DEFAULT 'member',
    `bio` VARCHAR(255) NOT NULL DEFAULT '',
    `skills` VARCHAR(255) NOT NULL DEFAULT '',
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Member_email_key`(`email`),
    PRIMARY KEY (`memberId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `reviewId` INTEGER NOT NULL AUTO_INCREMENT,
    `contributionId` INTEGER NOT NULL,
    `evaluatorId` INTEGER NOT NULL,
    `feedbackText` VARCHAR(191) NULL,
    `score` INTEGER NOT NULL,
    `feedbackDate` DATETIME(3) NOT NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`reviewId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Workshop` (
    `workshopId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `details` VARCHAR(191) NULL,
    `startDatetime` DATETIME(3) NOT NULL,
    `endDatetime` DATETIME(3) NOT NULL,
    `cost` DOUBLE NULL,
    `venue` VARCHAR(255) NULL,
    `virtualLink` VARCHAR(255) NULL,
    `resourceLink` VARCHAR(255) NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`workshopId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Registration` (
    `registrationId` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `workshopId` INTEGER NOT NULL,
    `signupDate` DATETIME(3) NOT NULL,
    `ticketCategory` ENUM('standard', 'scholar', 'exclusive') NOT NULL,
    `transactionStatus` ENUM('pending', 'settled', 'declined') NOT NULL DEFAULT 'pending',
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`registrationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contribution` (
    `contributionId` INTEGER NOT NULL AUTO_INCREMENT,
    `workshopId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `headline` VARCHAR(255) NOT NULL,
    `summary` VARCHAR(191) NULL,
    `submissionTime` DATETIME(3) NOT NULL,
    `currentState` ENUM('drafted', 'in_review', 'approved', 'dismissed') NOT NULL DEFAULT 'drafted',
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`contributionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agenda` (
    `agendaId` INTEGER NOT NULL AUTO_INCREMENT,
    `workshopId` INTEGER NOT NULL,
    `scheduledTime` DATETIME(3) NOT NULL,
    `location` VARCHAR(255) NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`agendaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mentorship` (
    `mentorshipId` INTEGER NOT NULL AUTO_INCREMENT,
    `mentorUserId` INTEGER NOT NULL,
    `menteeUserId` INTEGER NOT NULL,
    `initiationDate` DATETIME(3) NOT NULL,
    `conclusionDate` DATETIME(3) NULL,
    `mentorshipState` ENUM('active', 'completed', 'halted') NOT NULL DEFAULT 'active',
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`mentorshipId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_contributionId_fkey` FOREIGN KEY (`contributionId`) REFERENCES `Contribution`(`contributionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_evaluatorId_fkey` FOREIGN KEY (`evaluatorId`) REFERENCES `Member`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_workshopId_fkey` FOREIGN KEY (`workshopId`) REFERENCES `Workshop`(`workshopId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contribution` ADD CONSTRAINT `Contribution_workshopId_fkey` FOREIGN KEY (`workshopId`) REFERENCES `Workshop`(`workshopId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contribution` ADD CONSTRAINT `Contribution_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agenda` ADD CONSTRAINT `Agenda_workshopId_fkey` FOREIGN KEY (`workshopId`) REFERENCES `Workshop`(`workshopId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mentorship` ADD CONSTRAINT `Mentorship_mentorUserId_fkey` FOREIGN KEY (`mentorUserId`) REFERENCES `Member`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mentorship` ADD CONSTRAINT `Mentorship_menteeUserId_fkey` FOREIGN KEY (`menteeUserId`) REFERENCES `Member`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;
