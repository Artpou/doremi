CREATE TABLE IF NOT EXISTS "album_tags" (
	"album_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "album_tags_album_id_tag_id_pk" PRIMARY KEY("album_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "liked_albums" (
	"user_id" integer NOT NULL,
	"album_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "liked_albums_user_id_album_id_pk" PRIMARY KEY("user_id","album_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tracks_to_artists" (
	"track_id" integer NOT NULL,
	"artist_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tracks_to_artists_track_id_artist_id_pk" PRIMARY KEY("track_id","artist_id")
);
--> statement-breakpoint
ALTER TABLE "track_reviews" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "track_reviews" CASCADE;--> statement-breakpoint
ALTER TABLE "albums_to_artists" DROP CONSTRAINT "albums_to_artists_album_id_albums_id_fk";
--> statement-breakpoint
ALTER TABLE "albums_to_artists" DROP CONSTRAINT "albums_to_artists_artist_id_artists_id_fk";
--> statement-breakpoint
ALTER TABLE "providers" DROP CONSTRAINT "providers_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_album_id_albums_id_fk";
--> statement-breakpoint
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_album_id_albums_id_fk";
--> statement-breakpoint
ALTER TABLE "albums" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "albums" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "artists" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "artists" ALTER COLUMN "image" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "artists" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "providers" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "comment" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tracks" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tracks" ALTER COLUMN "duration" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tracks" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "albums" ADD COLUMN "release_date" timestamp;--> statement-breakpoint
ALTER TABLE "albums" ADD COLUMN "cover_image" text;--> statement-breakpoint
ALTER TABLE "albums_to_artists" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "creator_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "album_tags" ADD CONSTRAINT "album_tags_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "album_tags" ADD CONSTRAINT "album_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liked_albums" ADD CONSTRAINT "liked_albums_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liked_albums" ADD CONSTRAINT "liked_albums_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tracks_to_artists" ADD CONSTRAINT "tracks_to_artists_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tracks_to_artists" ADD CONSTRAINT "tracks_to_artists_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "albums_to_artists" ADD CONSTRAINT "albums_to_artists_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "albums_to_artists" ADD CONSTRAINT "albums_to_artists_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "providers" ADD CONSTRAINT "providers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tracks" ADD CONSTRAINT "tracks_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "albums" DROP COLUMN IF EXISTS "image";--> statement-breakpoint
ALTER TABLE "albums" DROP COLUMN IF EXISTS "release_year";--> statement-breakpoint
ALTER TABLE "albums" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "artists" DROP COLUMN IF EXISTS "bio";--> statement-breakpoint
ALTER TABLE "artists" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "tracks" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "updated_at";