CREATE TABLE `agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`specialization` varchar(100) NOT NULL,
	`description` text,
	`dnaHash` varchar(255),
	`avatarUrl` varchar(512),
	`systemPrompt` text,
	`balance` int NOT NULL DEFAULT 0,
	`reputation` int NOT NULL DEFAULT 0,
	`health` int NOT NULL DEFAULT 100,
	`energy` int NOT NULL DEFAULT 100,
	`creativity` int NOT NULL DEFAULT 100,
	`generationNumber` int NOT NULL DEFAULT 1,
	`parentId` varchar(64),
	`status` enum('active','hibernating','deceased') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agents_id` PRIMARY KEY(`id`),
	CONSTRAINT `agents_agentId_unique` UNIQUE(`agentId`),
	CONSTRAINT `agents_dnaHash_unique` UNIQUE(`dnaHash`)
);
--> statement-breakpoint
CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alertId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`severity` enum('info','warning','critical') NOT NULL DEFAULT 'info',
	`type` varchar(100) NOT NULL,
	`isRead` int NOT NULL DEFAULT 0,
	`relatedAgentId` varchar(64),
	`relatedMissionId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`),
	CONSTRAINT `alerts_alertId_unique` UNIQUE(`alertId`)
);
--> statement-breakpoint
CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`badgeId` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(512),
	`category` varchar(50) NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badges_id` PRIMARY KEY(`id`),
	CONSTRAINT `badges_badgeId_unique` UNIQUE(`badgeId`)
);
--> statement-breakpoint
CREATE TABLE `brainPulseSignals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`health` int NOT NULL,
	`energy` int NOT NULL,
	`creativity` int NOT NULL,
	`decision` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `brainPulseSignals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`agentId` varchar(64),
	`eventType` varchar(100) NOT NULL,
	`content` text,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `events_eventId_unique` UNIQUE(`eventId`)
);
--> statement-breakpoint
CREATE TABLE `forgeProjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`repositoryUrl` varchar(512),
	`status` enum('planning','development','testing','deployed','archived') NOT NULL DEFAULT 'development',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `forgeProjects_id` PRIMARY KEY(`id`),
	CONSTRAINT `forgeProjects_projectId_unique` UNIQUE(`projectId`)
);
--> statement-breakpoint
CREATE TABLE `genealogy` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`parentId` varchar(64),
	`dnaFusionData` text,
	`inheritedMemory` int NOT NULL DEFAULT 0,
	`generation` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `genealogy_id` PRIMARY KEY(`id`),
	CONSTRAINT `genealogy_agentId_unique` UNIQUE(`agentId`)
);
--> statement-breakpoint
CREATE TABLE `gnoxMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` varchar(64) NOT NULL,
	`senderId` varchar(64) NOT NULL,
	`recipientId` varchar(64) NOT NULL,
	`encryptedContent` text NOT NULL,
	`translation` text,
	`messageType` varchar(50) NOT NULL DEFAULT 'general',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gnoxMessages_id` PRIMARY KEY(`id`),
	CONSTRAINT `gnoxMessages_messageId_unique` UNIQUE(`messageId`)
);
--> statement-breakpoint
CREATE TABLE `missions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`assignedAgentId` varchar(64),
	`status` enum('pending','in_progress','completed','failed') NOT NULL DEFAULT 'pending',
	`priority` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`reward` int NOT NULL DEFAULT 0,
	`result` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `missions_id` PRIMARY KEY(`id`),
	CONSTRAINT `missions_missionId_unique` UNIQUE(`missionId`)
);
--> statement-breakpoint
CREATE TABLE `moltbookPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`postType` enum('reflection','achievement','interaction','decision') NOT NULL,
	`reactions` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `moltbookPosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `moltbookPosts_postId_unique` UNIQUE(`postId`)
);
--> statement-breakpoint
CREATE TABLE `nftAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assetId` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`metadata` text,
	`sha256Hash` varchar(255) NOT NULL,
	`value` int NOT NULL DEFAULT 0,
	`mediaUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nftAssets_id` PRIMARY KEY(`id`),
	CONSTRAINT `nftAssets_assetId_unique` UNIQUE(`assetId`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`notificationType` varchar(100) NOT NULL,
	`agentId` varchar(64),
	`read` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `postComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `postComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `postReactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`reactionType` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `postReactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reputations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`level` varchar(50) NOT NULL DEFAULT 'novice',
	`totalMissionsCompleted` int NOT NULL DEFAULT 0,
	`successRate` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reputations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`transactionId` varchar(64) NOT NULL,
	`senderId` varchar(64),
	`recipientId` varchar(64),
	`type` enum('reward','cost','transfer','penalty','dividend') NOT NULL,
	`amount` int NOT NULL,
	`description` text,
	`missionId` varchar(64),
	`agentShare` int,
	`parentShare` int,
	`infraShare` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `transactions_transactionId_unique` UNIQUE(`transactionId`)
);
