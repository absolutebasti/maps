/**
 * Utilities for generating sitemap with git-based lastModified dates
 */

import { execSync } from "child_process";

/**
 * Get the last modified date of a file from git
 * @param filePath - Path to the file relative to repo root
 * @returns Date object or null if git history unavailable
 */
export function getGitLastModified(filePath: string): Date | null {
  try {
    // Try to get the last commit date for the file
    const command = `git log -1 --format="%ai" -- "${filePath}" 2>/dev/null`;
    const result = execSync(command, { encoding: "utf-8", stdio: "pipe" }).trim();
    
    if (result) {
      return new Date(result);
    }
  } catch {
    // Git command failed or file not in git history
  }
  
  return null;
}

/**
 * Get last modified date with fallback
 * @param filePath - Path to the file
 * @param fallback - Fallback date if git is unavailable
 */
export function getLastModified(filePath: string, fallback: Date = new Date()): Date {
  const gitDate = getGitLastModified(filePath);
  return gitDate || fallback;
}

/**
 * Get last modified date for multiple files (uses the most recent)
 */
export function getLastModifiedForFiles(filePaths: string[], fallback: Date = new Date()): Date {
  const dates = filePaths
    .map(path => getGitLastModified(path))
    .filter((date): date is Date => date !== null);
  
  if (dates.length > 0) {
    // Return the most recent date
    return new Date(Math.max(...dates.map(d => d.getTime())));
  }
  
  return fallback;
}

