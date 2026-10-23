CREATE TABLE `cms_admins` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_admins_user_id_unique` ON `cms_admins` (`user_id`);--> statement-breakpoint
CREATE TABLE `cms_media` (
	`key` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`content_type` text NOT NULL,
	`created_at` text NOT NULL,
	`owner` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cms_publications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`document` text NOT NULL,
	`source_revision` integer NOT NULL,
	`published_at` text NOT NULL,
	`actor` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_publications_source_revision_unique` ON `cms_publications` (`source_revision`);--> statement-breakpoint
CREATE TABLE `cms_state` (
	`id` text PRIMARY KEY NOT NULL,
	`document` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL,
	`live_document` text NOT NULL,
	`live_revision` integer NOT NULL
);
