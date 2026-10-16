import client from "./client";

/* ------------------------------------------------------------------ *
 * Notifications endpoints
 * ------------------------------------------------------------------ */

// GET /notifications — notifications list with entity details (paginated)
export async function getNotifications(params) {
  const { data } = await client.get("/notifications", { params });
  return data;
}

// GET /notifications/unread-count — unread badge count
export async function getUnreadCount() {
  const { data } = await client.get("/notifications/unread-count");
  return data;
}

// PATCH /notifications/:notificationId/read — mark one as read
export async function markNotificationRead(notificationId) {
  const { data } = await client.patch(
    `/notifications/${notificationId}/read`
  );
  return data;
}

// PATCH /notifications/read-all — mark all as read
export async function markAllNotificationsRead() {
  const { data } = await client.patch("/notifications/read-all");
  return data;
}
