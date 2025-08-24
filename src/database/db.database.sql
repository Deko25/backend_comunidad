CREATE TABLE "roles" (
	"role_id" SERIAL,
	"role_name" VARCHAR(50) NOT NULL UNIQUE,
	PRIMARY KEY("role_id")
);

CREATE TABLE "users" (
	"user_id" SERIAL,
	"role_id" INTEGER,
	"first_name" VARCHAR(100) NOT NULL,
	"last_name" VARCHAR(100) NOT NULL,
	"email" VARCHAR(150) NOT NULL UNIQUE,
	"password_hash" VARCHAR(255) NOT NULL,
	"registration_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("user_id"),
	FOREIGN KEY("role_id") REFERENCES "roles"("role_id") ON DELETE SET NULL
);

CREATE TABLE "profiles" (
	"profile_id" SERIAL,
	"user_id" INTEGER NOT NULL UNIQUE,
	"bio" TEXT,
	"skills" TEXT,
	"experience" TEXT,
	"projects" TEXT,
	PRIMARY KEY("profile_id"),
	FOREIGN KEY("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "connections" (
	"connection_id" SERIAL,
	"follower_profile_id" INTEGER NOT NULL,
	"followed_profile_id" INTEGER NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("connection_id"),
	FOREIGN KEY("follower_profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE,
	FOREIGN KEY("followed_profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE
);

CREATE TABLE "posts" (
	"post_id" SERIAL,
	"profile_id" INTEGER NOT NULL,
	"text_content" TEXT,
	"image_url" VARCHAR(255),
	"code_url" VARCHAR(255),
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("post_id"),
	FOREIGN KEY("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE
);

CREATE TABLE "comments" (
	"comment_id" SERIAL,
	"post_id" INTEGER NOT NULL,
	"profile_id" INTEGER NOT NULL,
	"content" TEXT NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("comment_id"),
	FOREIGN KEY("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE,
	FOREIGN KEY("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE
);

CREATE TABLE "reactions" (
	"reaction_id" SERIAL,
	"post_id" INTEGER NOT NULL,
	"profile_id" INTEGER NOT NULL,
	"reaction_type" VARCHAR(50) NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("reaction_id"),
	FOREIGN KEY("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE,
	FOREIGN KEY("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE
);

CREATE TABLE "notifications" (
	"notification_id" SERIAL,
	"profile_id" INTEGER NOT NULL,
	"message" TEXT NOT NULL,
	"type" VARCHAR(50) NOT NULL,
	"date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"status" VARCHAR(20) DEFAULT 'unread',
	PRIMARY KEY("notification_id"),
	FOREIGN KEY("profile_id") REFERENCES "profiles"("profile_id") ON DELETE CASCADE
);

CREATE TABLE "chats" (
	"chat_id" SERIAL,
	"creation_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("chat_id")
);

CREATE TABLE "user_chats" (
	"user_chat_id" SERIAL,
	"chat_id" INTEGER NOT NULL,
	"user_id" INTEGER NOT NULL,
	PRIMARY KEY("user_chat_id"),
	FOREIGN KEY("chat_id") REFERENCES "chats"("chat_id") ON DELETE CASCADE,
	FOREIGN KEY("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
);

CREATE TABLE "messages" (
	"message_id" SERIAL,
	"chat_id" INTEGER NOT NULL,
	"user_id" INTEGER NOT NULL,
	"content" TEXT NOT NULL,
	"sent_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("message_id"),
	FOREIGN KEY("chat_id") REFERENCES "chats"("chat_id") ON DELETE CASCADE,
	FOREIGN KEY("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
);