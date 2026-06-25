function getTopNotifications(notifications, topN = 10) {
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

      const score =
        (priorityWeights[notification.priority] || 0) * 100 +
        recencyScore;

      return {
        ...notification,
        score,
      };
    });

  return prioritizedNotifications
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

const topNotifications = getTopNotifications(notifications, 10);

console.log("Priority Inbox");
console.log(topNotifications);
