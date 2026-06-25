const Log = require("./logger");

async function getTopNotifications(notifications, topN = 10) {
  try {
    const priorityWeights = {
      high: 3,
      medium: 2,
      low: 1,
    };

    const prioritizedNotifications = notifications
      .filter(notification => !notification.read)
      .map(notification => {
        const ageInHours =
          (Date.now() - new Date(notification.createdAt).getTime()) /
          (1000 * 60 * 60);

        const recencyScore = Math.max(0, 100 - ageInHours);

        return {
          ...notification,
          score:
            (priorityWeights[notification.priority] || 0) * 100 +
            recencyScore,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);

    await Log(
      "backend",
      "info",
      "notification-service",
      `Retrieved top ${topN} priority notifications`
    );

    return prioritizedNotifications;
  } catch (error) {
    await Log(
      "backend",
      "error",
      "notification-service",
      error.message
    );

    throw error;
  }
}

module.exports = { getTopNotifications };
