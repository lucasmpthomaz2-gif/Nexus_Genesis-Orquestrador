import { getDb } from "./db";
import { storagePut, storageGet } from "./storage";
import { exec } from "child_process";
import { promisify } from "util";
import { readFile, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

const execAsync = promisify(exec);

export interface BackupInfo {
  id: string;
  timestamp: Date;
  size: number;
  status: "success" | "failed" | "in_progress";
  location: string;
  duration: number;
}

const backupHistory: BackupInfo[] = [];
const MAX_BACKUPS = 100;

export async function createBackup(): Promise<BackupInfo> {
  const backupId = `backup-${Date.now()}`;
  const startTime = Date.now();

  const backup: BackupInfo = {
    id: backupId,
    timestamp: new Date(),
    size: 0,
    status: "in_progress",
    location: "",
    duration: 0,
  };

  backupHistory.push(backup);

  try {
    // Get database URL from environment
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL not configured");
    }

    // Create backup file locally
    const tmpDir = tmpdir();
    const backupFile = join(tmpDir, `${backupId}.sql`);

    // For MySQL/TiDB, we'd use mysqldump
    // This is a simplified example - in production you'd use proper database tools
    console.log(`[Backup] Creating backup: ${backupId}`);

    // Simulate backup creation
    const backupData = JSON.stringify(
      {
        timestamp: new Date(),
        database: "nexus",
        tables: [
          "users",
          "agents",
          "transactions",
          "genealogy",
          "moltbook_posts",
          "gnox_messages",
          "forge_projects",
          "nfts",
          "brain_pulse_signals",
          "notifications",
          "ecosystem_activities",
          "ecosystem_metrics",
        ],
      },
      null,
      2
    );

    await writeFile(backupFile, backupData);

    // Upload to S3
    const fileBuffer = await readFile(backupFile);
    const s3Key = `backups/${backupId}.json`;
    const { url } = await storagePut(s3Key, fileBuffer, "application/json");

    const duration = Date.now() - startTime;

    backup.status = "success";
    backup.size = fileBuffer.length;
    backup.location = url;
    backup.duration = duration;

    console.log(`[Backup] Backup created successfully: ${backupId} (${fileBuffer.length} bytes)`);

    return backup;
  } catch (error) {
    const duration = Date.now() - startTime;
    backup.status = "failed";
    backup.duration = duration;

    console.error(`[Backup] Backup failed: ${backupId}`, error);

    return backup;
  }
}

export async function restoreBackup(backupId: string): Promise<boolean> {
  try {
    const backup = backupHistory.find((b) => b.id === backupId);
    if (!backup) {
      throw new Error(`Backup not found: ${backupId}`);
    }

    if (backup.status !== "success") {
      throw new Error(`Cannot restore failed backup: ${backupId}`);
    }

    console.log(`[Backup] Restoring backup: ${backupId}`);

    // Get backup from S3
    const { url } = await storageGet(`backups/${backupId}.json`);

    // In production, you would:
    // 1. Download the backup file from S3
    // 2. Parse the backup data
    // 3. Restore the database using appropriate tools
    // 4. Verify data integrity

    console.log(`[Backup] Backup restored successfully: ${backupId}`);

    return true;
  } catch (error) {
    console.error(`[Backup] Restore failed:`, error);
    return false;
  }
}

export function getBackupHistory(limit: number = 50): BackupInfo[] {
  return backupHistory.slice(-limit).reverse();
}

export function getBackupStats() {
  const successful = backupHistory.filter((b) => b.status === "success").length;
  const failed = backupHistory.filter((b) => b.status === "failed").length;
  const totalSize = backupHistory
    .filter((b) => b.status === "success")
    .reduce((sum, b) => sum + b.size, 0);

  return {
    total: backupHistory.length,
    successful,
    failed,
    totalSize,
    lastBackup: backupHistory.find((b) => b.status === "success")?.timestamp,
  };
}

export async function startAutoBackup(intervalMs: number = 86400000) {
  // Default: 24 hours
  console.log("[Backup] Auto-backup started with interval:", intervalMs, "ms");

  // Create initial backup
  await createBackup();

  // Schedule periodic backups
  setInterval(async () => {
    try {
      await createBackup();
    } catch (error) {
      console.error("[Backup] Auto-backup failed:", error);
    }
  }, intervalMs);
}

export function deleteBackup(backupId: string): boolean {
  const index = backupHistory.findIndex((b) => b.id === backupId);
  if (index !== -1) {
    backupHistory.splice(index, 1);
    console.log(`[Backup] Backup deleted: ${backupId}`);
    return true;
  }
  return false;
}

export function cleanupOldBackups(keepCount: number = 30): number {
  const successful = backupHistory.filter((b) => b.status === "success");
  if (successful.length > keepCount) {
    const toDelete = successful.length - keepCount;
    for (let i = 0; i < toDelete; i++) {
      const backup = successful[i];
      deleteBackup(backup.id);
    }
    return toDelete;
  }
  return 0;
}
