-- CreateTable
CREATE TABLE "users" (
    "id_user" CHAR(64) NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "psw_hash" VARCHAR(72) NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "surnames" VARCHAR(30) NOT NULL,
    "description" VARCHAR(100),
    "location" VARCHAR(100),
    "country" VARCHAR(15) NOT NULL,
    "language" VARCHAR(2) DEFAULT 'es',
    "born_date" DATE NOT NULL,
    "register_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" VARCHAR(5) NOT NULL DEFAULT 'user',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "penalties_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id_user" CHAR(64) NOT NULL,
    "friend_id_user" CHAR(64) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id_user","friend_id_user")
);

-- CreateTable
CREATE TABLE "activities" (
    "id_activity" SERIAL NOT NULL,
    "id_user" CHAR(64) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(250) NOT NULL,
    "topic" VARCHAR(15) NOT NULL,
    "type" VARCHAR(15) NOT NULL,
    "date" TIMESTAMP(6),
    "location" VARCHAR(100),
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "status" VARCHAR(11) NOT NULL DEFAULT 'active',

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id_activity")
);

-- CreateTable
CREATE TABLE "exchanges" (
    "id_exchange" SERIAL NOT NULL,
    "requester_id_user" CHAR(64) NOT NULL,
    "target_id_user" CHAR(64) NOT NULL,
    "requested_activity" INTEGER NOT NULL,
    "offered_activity" INTEGER NOT NULL,
    "status" VARCHAR(9) NOT NULL DEFAULT 'pending',
    "requester_completed" BOOLEAN NOT NULL DEFAULT false,
    "target_completed" BOOLEAN NOT NULL DEFAULT false,
    "chain_id" INTEGER,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exchanges_pkey" PRIMARY KEY ("id_exchange")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id_review" SERIAL NOT NULL,
    "written_by" CHAR(64) NOT NULL,
    "written_to_user" CHAR(64) NOT NULL,
    "id_exchange" INTEGER NOT NULL,
    "content" VARCHAR(250) NOT NULL,
    "valoration" INTEGER NOT NULL,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_flagged" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id_review")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id_conversation" SERIAL NOT NULL,
    "id_exchange" INTEGER,
    "type" VARCHAR(15) NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id_conversation")
);

-- CreateTable
CREATE TABLE "participants" (
    "id_conversation" INTEGER NOT NULL,
    "id_user" CHAR(64) NOT NULL,
    "rol" VARCHAR(10) NOT NULL DEFAULT 'member',

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id_conversation","id_user")
);

-- CreateTable
CREATE TABLE "messages" (
    "id_message" SERIAL NOT NULL,
    "id_conversation" INTEGER NOT NULL,
    "id_user_sender" CHAR(64) NOT NULL,
    "content" VARCHAR(500),
    "attachment_url" VARCHAR(255),
    "id_exchange" INTEGER,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "send_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id_message")
);

-- CreateTable
CREATE TABLE "penalties" (
    "id_penalty" SERIAL NOT NULL,
    "id_user" CHAR(64) NOT NULL,
    "admin_id_user" CHAR(64),
    "id_review" INTEGER,
    "id_exchange" INTEGER,
    "reason" VARCHAR(500) NOT NULL,
    "given_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "penalties_pkey" PRIMARY KEY ("id_penalty")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_written_by_id_exchange_key" ON "reviews"("written_by", "id_exchange");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_friend_id_user_fkey" FOREIGN KEY ("friend_id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchanges" ADD CONSTRAINT "exchanges_requester_id_user_fkey" FOREIGN KEY ("requester_id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchanges" ADD CONSTRAINT "exchanges_target_id_user_fkey" FOREIGN KEY ("target_id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchanges" ADD CONSTRAINT "exchanges_requested_activity_fkey" FOREIGN KEY ("requested_activity") REFERENCES "activities"("id_activity") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchanges" ADD CONSTRAINT "exchanges_offered_activity_fkey" FOREIGN KEY ("offered_activity") REFERENCES "activities"("id_activity") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_written_by_fkey" FOREIGN KEY ("written_by") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_written_to_user_fkey" FOREIGN KEY ("written_to_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_id_exchange_fkey" FOREIGN KEY ("id_exchange") REFERENCES "exchanges"("id_exchange") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_id_exchange_fkey" FOREIGN KEY ("id_exchange") REFERENCES "exchanges"("id_exchange") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_id_conversation_fkey" FOREIGN KEY ("id_conversation") REFERENCES "conversations"("id_conversation") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_id_conversation_fkey" FOREIGN KEY ("id_conversation") REFERENCES "conversations"("id_conversation") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_id_user_sender_fkey" FOREIGN KEY ("id_user_sender") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_id_exchange_fkey" FOREIGN KEY ("id_exchange") REFERENCES "exchanges"("id_exchange") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_admin_id_user_fkey" FOREIGN KEY ("admin_id_user") REFERENCES "users"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_id_review_fkey" FOREIGN KEY ("id_review") REFERENCES "reviews"("id_review") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_id_exchange_fkey" FOREIGN KEY ("id_exchange") REFERENCES "exchanges"("id_exchange") ON DELETE SET NULL ON UPDATE CASCADE;
