CREATE TABLE "roles" (
	"role_id" SERIAL PRIMARY KEY,
	"role_name" VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE "users" (
	"user_id" SERIAL PRIMARY KEY,
	"role_id" INTEGER,
	"first_name" VARCHAR(100) NOT NULL,
	"last_name" VARCHAR(100) NOT NULL,
	"email" VARCHAR(150) NOT NULL UNIQUE,
	"password_hash" VARCHAR(255) NOT NULL,
	"registration_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("role_id") REFERENCES "roles"("role_id") ON DELETE SET NULL
);

CREATE TABLE "profiles" (
	"profile_id" SERIAL PRIMARY KEY,
	"user_id" INTEGER NOT NULL UNIQUE,
	"bio" TEXT,
	"skills" TEXT,
	"experience" TEXT,
	"projects" TEXT,
	FOREIGN KEY("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
);


CREATE TABLE "friendships" (
	"friendship_id" SERIAL PRIMARY KEY,
	"requester_profile_id" INTEGER NOT NULL,
	"receiver_profile_id" INTEGER NOT NULL,  
	"status" VARCHAR(20) NOT NULL DEFAULT 'pending', 
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("requester_profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE,
	FOREIGN KEY("receiver_profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE,
	CONSTRAINT unique_friendship UNIQUE("requester_profile_id", "receiver_profile_id")
);

CREATE TABLE "posts" (
	"post_id" SERIAL PRIMARY KEY,
	"profile_id" INTEGER NOT NULL,
	"text_content" TEXT,
	"image_url" VARCHAR(255),
	"code_url" VARCHAR(255),
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE
);

CREATE TABLE "comments" (
	"comment_id" SERIAL PRIMARY KEY,
	"post_id" INTEGER NOT NULL,
	"profile_id" INTEGER NOT NULL,
	"content" TEXT NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE,
	FOREIGN KEY("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE
);

CREATE TABLE "reactions" (
	"reaction_id" SERIAL PRIMARY KEY,
	"post_id" INTEGER NOT NULL,
	"profile_id" INTEGER NOT NULL,
	"reaction_type" VARCHAR(50) NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE,
	FOREIGN KEY("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE
);

CREATE TABLE "notifications" (
	"notification_id" SERIAL PRIMARY KEY,
	"profile_id" INTEGER NOT NULL,
	"message" TEXT NOT NULL,
	"type" VARCHAR(50) NOT NULL,
	"date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"status" VARCHAR(20) DEFAULT 'unread',
	FOREIGN KEY("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE
);

CREATE TABLE "chats" (
	"chat_id" SERIAL PRIMARY KEY,
	"creation_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user_chats" (
	"user_chat_id" SERIAL PRIMARY KEY,
	"chat_id" INTEGER NOT NULL,
	"user_id" INTEGER NOT NULL,
	FOREIGN KEY("chat_id") REFERENCES "chats"("chat_id") ON DELETE CASCADE,
	FOREIGN KEY("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "messages" (
	"message_id" SERIAL PRIMARY KEY,
	"chat_id" INTEGER NOT NULL,
	"user_id" INTEGER NOT NULL,
	"content" TEXT NOT NULL,
	"sent_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("chat_id") REFERENCES "chats"("chat_id") ON DELETE CASCADE,
	FOREIGN KEY("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
);