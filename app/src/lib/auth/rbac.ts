/**
 * Role-Based Access Control (RBAC) Middleware
 * Validates user permissions based on their role in the tenant
 */

import { db } from "@/lib/db";
import { tenantUsers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export type UserRole = "owner" | "admin" | "member";

export interface RBACCheck {
  allowed: boolean;
  reason?: string;
  userRole?: UserRole;
}

/**
 * Permission matrix defining what each role can do
 */
const PERMISSIONS = {
  // Survey permissions
  "survey:create": ["owner", "admin", "member"],
  "survey:read": ["owner", "admin", "member"],
  "survey:update": ["owner", "admin"],
  "survey:delete": ["owner", "admin"],
  "survey:publish": ["owner", "admin"],

  // Tenant permissions
  "tenant:update": ["owner"],
  "tenant:delete": ["owner"],
  "tenant:billing": ["owner"],

  // User management permissions
  "user:invite": ["owner", "admin"],
  "user:remove": ["owner", "admin"],
  "user:update_role": ["owner"],

  // Analytics permissions
  "analytics:view": ["owner", "admin", "member"],
  "analytics:export": ["owner", "admin"],

  // AI permissions
  "ai:generate": ["owner", "admin", "member"],
  "ai:analyze": ["owner", "admin"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Get user's role in a specific tenant
 */
export async function getUserRole(
  userId: string,
  tenantId: string
): Promise<UserRole | null> {
  const tenantUser = await db.query.tenantUsers.findFirst({
    where: and(
      eq(tenantUsers.userId, userId),
      eq(tenantUsers.tenantId, tenantId)
    ),
  });

  return tenantUser?.role as UserRole | null;
}

/**
 * Check if a user has a specific permission in a tenant
 */
export async function checkPermission(
  userId: string,
  tenantId: string,
  permission: Permission
): Promise<RBACCheck> {
  // Get user's role
  const userRole = await getUserRole(userId, tenantId);

  if (!userRole) {
    return {
      allowed: false,
      reason: "User is not a member of this tenant",
    };
  }

  // Check if role has permission
  const allowedRoles = PERMISSIONS[permission] as readonly UserRole[];
  const hasPermission = allowedRoles.includes(userRole);

  if (!hasPermission) {
    return {
      allowed: false,
      reason: `Role '${userRole}' does not have permission '${permission}'`,
      userRole,
    };
  }

  return {
    allowed: true,
    userRole,
  };
}

/**
 * Middleware-style function to require a specific permission
 * Throws an error if permission is denied
 */
export async function requirePermission(
  userId: string,
  tenantId: string,
  permission: Permission
): Promise<UserRole> {
  const check = await checkPermission(userId, tenantId, permission);

  if (!check.allowed) {
    throw new Error(check.reason || "Permission denied");
  }

  return check.userRole!;
}

/**
 * Check if user has any of the specified roles
 */
export async function hasRole(
  userId: string,
  tenantId: string,
  roles: UserRole[]
): Promise<boolean> {
  const userRole = await getUserRole(userId, tenantId);
  return userRole ? roles.includes(userRole) : false;
}

/**
 * Check if user is owner of the tenant
 */
export async function isOwner(
  userId: string,
  tenantId: string
): Promise<boolean> {
  return hasRole(userId, tenantId, ["owner"]);
}

/**
 * Check if user is owner or admin
 */
export async function isOwnerOrAdmin(
  userId: string,
  tenantId: string
): Promise<boolean> {
  return hasRole(userId, tenantId, ["owner", "admin"]);
}
