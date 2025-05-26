import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes without conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Formats a date to ISO string format (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Gets color class for priority level
 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Low":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
}

/**
 * Gets color class for status
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "Pending":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "In Review":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
}

/**
 * Converts a string to Title Case
 */

export function toTitleCase(str: string){
  return str
  .toLowerCase()
  .split(" ")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
}