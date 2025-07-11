-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MEMBER', 'OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BabyGender" AS ENUM ('BOY', 'GIRL', 'UNDISCLOSED');

-- CreateEnum
CREATE TYPE "FeedingType" AS ENUM ('BREAST_LEFT', 'BREAST_RIGHT', 'BOTTLE_FORMULA', 'BOTTLE_PUMPED_MILK', 'SOLID_FOOD');

-- CreateEnum
CREATE TYPE "DiaperType" AS ENUM ('WET', 'DIRTY', 'MIXED');

-- CreateEnum
CREATE TYPE "DiaperColor" AS ENUM ('YELLOW', 'GREEN', 'BROWN', 'BLACK', 'RED', 'OTHER');

-- CreateEnum
CREATE TYPE "DiaperConsistency" AS ENUM ('SOFT', 'LOOSE', 'FIRM', 'WATERY', 'PELLET', 'OTHER');

-- CreateEnum
CREATE TYPE "SleepLocation" AS ENUM ('CRIB', 'STROLLER', 'CARRIER', 'BED', 'OTHER');

-- CreateEnum
CREATE TYPE "RoutineType" AS ENUM ('FEEDING', 'SLEEP', 'DIAPER', 'PLAY', 'MEDICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "RoutineFrequencyUnit" AS ENUM ('HOURS', 'DAYS', 'WEEKS', 'MONTHS');

-- CreateEnum
CREATE TYPE "MilestoneCategory" AS ENUM ('MOTOR_SKILLS', 'COGNITIVE', 'SOCIAL_EMOTIONAL', 'LANGUAGE', 'FIRSTS', 'OTHER');

-- CreateEnum
CREATE TYPE "MeasurementUnit" AS ENUM ('KG', 'LBS', 'CM', 'IN');

-- CreateEnum
CREATE TYPE "DoctorAppointmentType" AS ENUM ('ROUTINE_CHECKUP', 'VACCINATION', 'SPECIALIST', 'URGENT', 'OTHER');

-- CreateEnum
CREATE TYPE "PhotoSource" AS ENUM ('UPLOAD', 'MILESTONE', 'ACTIVITY');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('REMINDER_ROUTINE', 'REMINDER_APPOINTMENT', 'DAILY_SUMMARY', 'NEW_MILESTONE_SUGGESTION', 'ACCOUNT_ACTIVITY', 'CONTENT_UPDATE', 'OTHER');

-- CreateEnum
CREATE TYPE "ActivityTemplateType" AS ENUM ('FEEDING', 'SLEEP', 'DIAPER', 'MEDICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "DataExportType" AS ENUM ('PDF', 'CSV', 'JSON');

-- CreateEnum
CREATE TYPE "DataExportStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ContentCategory" AS ENUM ('DEVELOPMENT', 'HEALTH', 'NUTRITION', 'SLEEP', 'PLAY', 'PARENTING_BASICS', 'SAFETY', 'POSTPARTUM', 'OTHER');

-- CreateEnum
CREATE TYPE "ContentLanguage" AS ENUM ('EN', 'NO');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Baby" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "BabyGender",
    "avatarUrl" TEXT,
    "bio" TEXT,
    "timezone" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Baby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BabyMembership" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "invitedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BabyMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feeding" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "FeedingType" NOT NULL,
    "amount" DOUBLE PRECISION,
    "unit" "MeasurementUnit",
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feeding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sleep" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "location" "SleepLocation",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sleep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diaper" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "DiaperType" NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "color" "DiaperColor",
    "consistency" "DiaperConsistency",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "category" "MilestoneCategory",
    "isSuggested" BOOLEAN NOT NULL DEFAULT false,
    "photoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthEntry" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" DOUBLE PRECISION,
    "weightUnit" "MeasurementUnit",
    "height" DOUBLE PRECISION,
    "heightUnit" "MeasurementUnit",
    "headCircumference" DOUBLE PRECISION,
    "headCircUnit" "MeasurementUnit",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrowthEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "RoutineType",
    "startTimeStr" TEXT NOT NULL,
    "endTimeStr" TEXT,
    "frequencyValue" INTEGER,
    "frequencyUnit" "RoutineFrequencyUnit",
    "daysOfWeek" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "PhotoSource",
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "originalFilename" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorAppointment" (
    "id" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "DoctorAppointmentType",
    "dateTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "vaccineGiven" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyDevelopmentInfo" (
    "id" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "language" "ContentLanguage" NOT NULL DEFAULT 'EN',
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyDevelopmentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "ContentCategory",
    "minAgeWeeks" INTEGER,
    "maxAgeWeeks" INTEGER,
    "author" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "language" "ContentLanguage" NOT NULL DEFAULT 'EN',
    "submittedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "content" TEXT,
    "category" "ContentCategory",
    "imageUrl" TEXT,
    "language" "ContentLanguage" NOT NULL DEFAULT 'EN',
    "submittedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "babyId" TEXT,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "scheduledFor" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "babyId" TEXT,
    "name" TEXT NOT NULL,
    "type" "ActivityTemplateType" NOT NULL,
    "defaultValues" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataExport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "babyId" TEXT,
    "exportType" "DataExportType" NOT NULL,
    "status" "DataExportStatus" NOT NULL,
    "fileUrl" TEXT,
    "initiatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataExport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Baby_userId_idx" ON "Baby"("userId");

-- CreateIndex
CREATE INDEX "Baby_isDeleted_idx" ON "Baby"("isDeleted");

-- CreateIndex
CREATE INDEX "BabyMembership_userId_babyId_idx" ON "BabyMembership"("userId", "babyId");

-- CreateIndex
CREATE UNIQUE INDEX "BabyMembership_babyId_userId_key" ON "BabyMembership"("babyId", "userId");

-- CreateIndex
CREATE INDEX "Feeding_babyId_startTime_idx" ON "Feeding"("babyId", "startTime");

-- CreateIndex
CREATE INDEX "Feeding_userId_startTime_idx" ON "Feeding"("userId", "startTime");

-- CreateIndex
CREATE INDEX "Feeding_babyId_userId_startTime_idx" ON "Feeding"("babyId", "userId", "startTime");

-- CreateIndex
CREATE INDEX "Sleep_babyId_startTime_idx" ON "Sleep"("babyId", "startTime");

-- CreateIndex
CREATE INDEX "Sleep_userId_startTime_idx" ON "Sleep"("userId", "startTime");

-- CreateIndex
CREATE INDEX "Sleep_babyId_userId_startTime_idx" ON "Sleep"("babyId", "userId", "startTime");

-- CreateIndex
CREATE INDEX "Diaper_babyId_time_idx" ON "Diaper"("babyId", "time");

-- CreateIndex
CREATE INDEX "Diaper_userId_time_idx" ON "Diaper"("userId", "time");

-- CreateIndex
CREATE INDEX "Diaper_babyId_userId_time_idx" ON "Diaper"("babyId", "userId", "time");

-- CreateIndex
CREATE UNIQUE INDEX "Milestone_photoId_key" ON "Milestone"("photoId");

-- CreateIndex
CREATE INDEX "Milestone_babyId_date_idx" ON "Milestone"("babyId", "date");

-- CreateIndex
CREATE INDEX "Milestone_userId_date_idx" ON "Milestone"("userId", "date");

-- CreateIndex
CREATE INDEX "Milestone_babyId_userId_date_idx" ON "Milestone"("babyId", "userId", "date");

-- CreateIndex
CREATE INDEX "GrowthEntry_babyId_date_idx" ON "GrowthEntry"("babyId", "date");

-- CreateIndex
CREATE INDEX "GrowthEntry_userId_date_idx" ON "GrowthEntry"("userId", "date");

-- CreateIndex
CREATE INDEX "GrowthEntry_babyId_userId_date_idx" ON "GrowthEntry"("babyId", "userId", "date");

-- CreateIndex
CREATE INDEX "Routine_babyId_isActive_idx" ON "Routine"("babyId", "isActive");

-- CreateIndex
CREATE INDEX "Routine_userId_isActive_idx" ON "Routine"("userId", "isActive");

-- CreateIndex
CREATE INDEX "Photo_babyId_timestamp_idx" ON "Photo"("babyId", "timestamp");

-- CreateIndex
CREATE INDEX "Photo_userId_timestamp_idx" ON "Photo"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "DoctorAppointment_babyId_dateTime_idx" ON "DoctorAppointment"("babyId", "dateTime");

-- CreateIndex
CREATE INDEX "DoctorAppointment_userId_dateTime_idx" ON "DoctorAppointment"("userId", "dateTime");

-- CreateIndex
CREATE INDEX "DoctorAppointment_babyId_isCompleted_idx" ON "DoctorAppointment"("babyId", "isCompleted");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyDevelopmentInfo_weekNumber_key" ON "WeeklyDevelopmentInfo"("weekNumber");

-- CreateIndex
CREATE INDEX "WeeklyDevelopmentInfo_weekNumber_language_isActive_idx" ON "WeeklyDevelopmentInfo"("weekNumber", "language", "isActive");

-- CreateIndex
CREATE INDEX "Tip_category_minAgeWeeks_maxAgeWeeks_idx" ON "Tip"("category", "minAgeWeeks", "maxAgeWeeks");

-- CreateIndex
CREATE INDEX "Tip_language_idx" ON "Tip"("language");

-- CreateIndex
CREATE INDEX "Resource_category_idx" ON "Resource"("category");

-- CreateIndex
CREATE INDEX "Resource_language_idx" ON "Resource"("language");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_babyId_isRead_idx" ON "Notification"("babyId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_userId_babyId_isRead_idx" ON "Notification"("userId", "babyId", "isRead");

-- CreateIndex
CREATE INDEX "ActivityTemplate_userId_type_idx" ON "ActivityTemplate"("userId", "type");

-- CreateIndex
CREATE INDEX "ActivityTemplate_babyId_type_idx" ON "ActivityTemplate"("babyId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityTemplate_userId_name_key" ON "ActivityTemplate"("userId", "name");

-- CreateIndex
CREATE INDEX "DataExport_userId_status_idx" ON "DataExport"("userId", "status");

-- CreateIndex
CREATE INDEX "DataExport_babyId_status_idx" ON "DataExport"("babyId", "status");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Baby" ADD CONSTRAINT "Baby_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BabyMembership" ADD CONSTRAINT "BabyMembership_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BabyMembership" ADD CONSTRAINT "BabyMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BabyMembership" ADD CONSTRAINT "BabyMembership_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feeding" ADD CONSTRAINT "Feeding_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feeding" ADD CONSTRAINT "Feeding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sleep" ADD CONSTRAINT "Sleep_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sleep" ADD CONSTRAINT "Sleep_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diaper" ADD CONSTRAINT "Diaper_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diaper" ADD CONSTRAINT "Diaper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthEntry" ADD CONSTRAINT "GrowthEntry_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthEntry" ADD CONSTRAINT "GrowthEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAppointment" ADD CONSTRAINT "DoctorAppointment_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAppointment" ADD CONSTRAINT "DoctorAppointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTemplate" ADD CONSTRAINT "ActivityTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTemplate" ADD CONSTRAINT "ActivityTemplate_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataExport" ADD CONSTRAINT "DataExport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataExport" ADD CONSTRAINT "DataExport_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE SET NULL ON UPDATE CASCADE;
