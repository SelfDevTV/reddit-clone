/*
  Warnings:

  - You are about to drop the column `isDownvote` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `Subreddit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `infoBoxText` to the `Subreddit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteType` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Subreddit" ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "infoBoxText" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "isDownvote",
ADD COLUMN     "voteType" "VoteType" NOT NULL;

-- CreateTable
CREATE TABLE "_SubredditToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SubredditToUser_AB_unique" ON "_SubredditToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SubredditToUser_B_index" ON "_SubredditToUser"("B");

-- AddForeignKey
ALTER TABLE "_SubredditToUser" ADD FOREIGN KEY("A")REFERENCES "Subreddit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubredditToUser" ADD FOREIGN KEY("B")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
