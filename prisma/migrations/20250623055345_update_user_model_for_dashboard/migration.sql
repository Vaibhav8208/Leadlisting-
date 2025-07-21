-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "leadsAssigned" INTEGER NOT NULL DEFAULT 0,
    "leadsConverted" INTEGER NOT NULL DEFAULT 0,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Lead (corrected)
CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "assignee" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" VARCHAR(100),
    "nextFollowUpDate" DATE,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

CREATE TABLE "CallLog" (
  "id" SERIAL PRIMARY KEY,
  "leadId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CallLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE
);



CREATE TABLE "CallHistory" (
    "id" SERIAL NOT NULL,
    "leadId" INTEGER NOT NULL,
    "leadName" TEXT NOT NULL,
    "caller" TEXT NOT NULL,
    "callType" TEXT NOT NULL, -- 'inbound' or 'outbound'
    "duration" TEXT NOT NULL, -- e.g., '15:30'
    "outcome" TEXT NOT NULL,  -- e.g., 'interested', 'follow-up'
    "date" DATE NOT NULL,
    "time" TEXT NOT NULL,
    "notes" TEXT,
    "nextAction" TEXT,
    "nextFollowUp" DATE,
    CONSTRAINT "CallHistory_pkey" PRIMARY KEY ("id")
);

