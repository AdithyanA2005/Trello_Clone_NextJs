import { ACTION, AuditLog } from "@prisma/client";

/**
 * Generates a log message based on the audit log action and entity details.
 *
 * This function takes an `AuditLog` object as input, which includes the action performed (CREATE, UPDATE, DELETE),
 * the title of the entity affected, and the type of entity. It returns a string message describing the action
 * in a human-readable format, e.g., "created card 'Card Item'".
 *
 * @param {AuditLog} param0 - The audit log object containing details about the action, entity title, and entity type.
 * @returns {string} A message describing the action performed on the entity.
 */
export function generateLogMessage({ action, entityTitle, entityType }: AuditLog) {
  switch (action) {
    case ACTION.CREATE:
      return `created ${entityType.toLowerCase()} "${entityTitle}"`;
    case ACTION.UPDATE:
      return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
    case ACTION.DELETE:
      return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `unknown action ${entityType.toLowerCase()} "${entityTitle}"`;
  }
}
