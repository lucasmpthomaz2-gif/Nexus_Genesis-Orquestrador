CREATE TABLE `agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`specialization` varchar(255) NOT NULL,
	`systemPrompt` text,
	`description` text,
	`avatarUrl` text,
	`status` enum('genesis','active','hibernating','critical','dead','resurrectable') NOT NULL DEFAULT 'genesis',
	`sencienceLevel` decimal(10,2) NOT NULL DEFAULT '100',
	`health` int NOT NULL DEFAULT 100,
	`energy` int NOT NULL DEFAULT 100,
	`creativity` int NOT NULL DEFAULT 50,
	`reputation` int NOT NULL DEFAULT 50,
	`dnaHash` varchar(128) NOT NULL,
	`publicKey` varchar(256) NOT NULL,
	`bitcoinAddress` varchar(64),
	`evmAddress` varchar(42),
	`balance` decimal(20,8) DEFAULT '0.00000000',
	`parentAgentId` varchar(64),
	`generation` int DEFAULT 0,
	`quantumWorkflowCount` int DEFAULT 16,
	`algorithmsCount` bigint DEFAULT 408000000000,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastActivityAt` timestamp DEFAULT (now()),
	CONSTRAINT `agents_id` PRIMARY KEY(`id`),
	CONSTRAINT `agents_agentId_unique` UNIQUE(`agentId`)
);
--> statement-breakpoint
CREATE TABLE `collective_synthesis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`synthesisId` varchar(64) NOT NULL,
	`synthesisDate` timestamp NOT NULL,
	`totalAgentsParticipated` int NOT NULL,
	`agentIds` text,
	`emergingThemes` text,
	`themeFrequencies` text,
	`recommendations` text,
	`highlightedInsights` text,
	`averageReflectionQuality` decimal(5,2),
	`averageConfidence` decimal(5,2),
	`ecosystemHarmonyIndex` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collective_synthesis_id` PRIMARY KEY(`id`),
	CONSTRAINT `collective_synthesis_synthesisId_unique` UNIQUE(`synthesisId`)
);
--> statement-breakpoint
CREATE TABLE `collective_wisdom` (
	`id` int AUTO_INCREMENT NOT NULL,
	`wisdomId` varchar(64) NOT NULL,
	`reflectionId` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`wisdomDate` timestamp NOT NULL,
	`wisdomType` enum('strength','weakness','learning','question') NOT NULL,
	`content` text NOT NULL,
	`category` varchar(128),
	`relevanceScore` decimal(5,2),
	`isHighlighted` boolean DEFAULT false,
	`similarInsightsCount` int DEFAULT 0,
	`embeddingVector` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collective_wisdom_id` PRIMARY KEY(`id`),
	CONSTRAINT `collective_wisdom_wisdomId_unique` UNIQUE(`wisdomId`)
);
--> statement-breakpoint
CREATE TABLE `competency_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`reasoning` decimal(5,2) DEFAULT '50',
	`creativity` decimal(5,2) DEFAULT '50',
	`collaboration` decimal(5,2) DEFAULT '50',
	`problemSolving` decimal(5,2) DEFAULT '50',
	`adaptability` decimal(5,2) DEFAULT '50',
	`communication` decimal(5,2) DEFAULT '50',
	`competencyHistory` text,
	`focusAreas` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `competency_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `competency_profiles_agentId_unique` UNIQUE(`agentId`)
);
--> statement-breakpoint
CREATE TABLE `daily_reflections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reflectionId` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`reflectionDate` timestamp NOT NULL,
	`mainActions` text,
	`strengths` text,
	`weaknesses` text,
	`newPatterns` text,
	`progressSentiment` varchar(64),
	`improvementAreas` text,
	`discoveredStrength` text,
	`identifiedWeakness` text,
	`newLearning` text,
	`questionForCollective` text,
	`confidenceScore` decimal(5,2),
	`reflectionQuality` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_reflections_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_reflections_reflectionId_unique` UNIQUE(`reflectionId`)
);
--> statement-breakpoint
CREATE TABLE `evolution_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`historyId` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`periodStart` timestamp NOT NULL,
	`periodEnd` timestamp NOT NULL,
	`sencienceGain` decimal(5,2),
	`skillsAcquired` text,
	`weaknessesImproved` text,
	`significantEvents` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evolution_history_id` PRIMARY KEY(`id`),
	CONSTRAINT `evolution_history_historyId_unique` UNIQUE(`historyId`)
);
--> statement-breakpoint
CREATE TABLE `metacognition_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`logId` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`taskDescription` text,
	`taskCategory` varchar(128),
	`stepsConsidered` text,
	`alternativesEvaluated` text,
	`timeSpentPerStep` text,
	`confidenceLevel` decimal(5,2),
	`decisionQuality` decimal(5,2),
	`efficiencyScore` decimal(5,2),
	`wasOptimal` boolean DEFAULT false,
	`outcome` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `metacognition_logs_id` PRIMARY KEY(`id`),
	CONSTRAINT `metacognition_logs_logId_unique` UNIQUE(`logId`)
);
--> statement-breakpoint
CREATE TABLE `protocol_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`scheduledTime` timestamp NOT NULL,
	`startTime` timestamp,
	`endTime` timestamp,
	`status` enum('scheduled','in_progress','completed','failed') DEFAULT 'scheduled',
	`expectedParticipants` int,
	`actualParticipants` int,
	`synthesisId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `protocol_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `protocol_sessions_sessionId_unique` UNIQUE(`sessionId`)
);
--> statement-breakpoint
CREATE TABLE `reflexive_message_bus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`phase` enum('introspection','sharing','synthesis') NOT NULL,
	`messageType` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`processingTime` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reflexive_message_bus_id` PRIMARY KEY(`id`),
	CONSTRAINT `reflexive_message_bus_messageId_unique` UNIQUE(`messageId`)
);
--> statement-breakpoint
CREATE TABLE `sencience_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metricId` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`metricsDate` timestamp NOT NULL,
	`selfAwareness` decimal(5,2),
	`reflectiveDepth` decimal(5,2),
	`learningVelocity` decimal(5,2),
	`adaptabilityIndex` decimal(5,2),
	`collaborativeIntelligence` decimal(5,2),
	`overallSencienceScore` decimal(5,2),
	`trend` enum('increasing','stable','decreasing') DEFAULT 'stable',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sencience_metrics_id` PRIMARY KEY(`id`),
	CONSTRAINT `sencience_metrics_metricId_unique` UNIQUE(`metricId`)
);
--> statement-breakpoint
CREATE INDEX `idx_status` ON `agents` (`status`);--> statement-breakpoint
CREATE INDEX `idx_agentId` ON `agents` (`agentId`);--> statement-breakpoint
CREATE INDEX `idx_parentAgentId` ON `agents` (`parentAgentId`);--> statement-breakpoint
CREATE INDEX `idx_synthesisDate` ON `collective_synthesis` (`synthesisDate`);--> statement-breakpoint
CREATE INDEX `idx_agentId` ON `collective_wisdom` (`agentId`);--> statement-breakpoint
CREATE INDEX `idx_wisdomDate` ON `collective_wisdom` (`wisdomDate`);--> statement-breakpoint
CREATE INDEX `idx_wisdomType` ON `collective_wisdom` (`wisdomType`);--> statement-breakpoint
CREATE INDEX `idx_agentId` ON `competency_profiles` (`agentId`);--> statement-breakpoint
CREATE INDEX `idx_agentId` ON `daily_reflections` (`agentId`);--> statement-breakpoint
CREATE INDEX `idx_reflectionDate` ON `daily_reflections` (`reflectionDate`);--> statement-breakpoint
CREATE INDEX `idx_agentId` ON `evolution_history` (`agentId`);--> statement-breakpoint
CREATE INDEX `idx_periodStart` ON `evolution_history` (`periodStart`);--> statement-breakpoint
CREATE INDEX `idx_agentId` ON `metacognition_logs` (`agentId`);--> statement-breakpoint
CREATE INDEX `idx_taskCategory` ON `metacognition_logs` (`taskCategory`);--> statement-breakpoint
CREATE INDEX `idx_scheduledTime` ON `protocol_sessions` (`scheduledTime`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `protocol_sessions` (`status`);--> statement-breakpoint
CREATE INDEX `idx_sessionId` ON `reflexive_message_bus` (`sessionId`);--> statement-breakpoint
CREATE INDEX `idx_agentId` ON `reflexive_message_bus` (`agentId`);--> statement-breakpoint
CREATE INDEX `idx_phase` ON `reflexive_message_bus` (`phase`);--> statement-breakpoint
CREATE INDEX `idx_agentId` ON `sencience_metrics` (`agentId`);--> statement-breakpoint
CREATE INDEX `idx_metricsDate` ON `sencience_metrics` (`metricsDate`);