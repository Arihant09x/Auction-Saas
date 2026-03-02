/**
 * Returns true if the user is either the owner of the resource
 * OR has the ADMIN role (which bypasses ownership checks).
 *
 * Use this helper in every service that previously did:
 *   if (resource.organizerId !== userId) throw ForbiddenException(...)
 *
 * Replace with:
 *   if (!isAdminOrOwner(resource.organizerId, userId, userRole)) throw ForbiddenException(...)
 */
export function isAdminOrOwner(
    ownerId: string,
    requesterId: string,
    requesterRole: string,
): boolean {
    return ownerId === requesterId || requesterRole === 'ADMIN';
}
