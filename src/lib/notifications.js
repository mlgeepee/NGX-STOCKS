/**
 * Web Push Notification utilities for price alerts
 */

export function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return Promise.resolve(false);
    }

    if (Notification.permission === 'granted') {
        return Promise.resolve(true);
    }

    if (Notification.permission !== 'denied') {
        return Notification.requestPermission().then((permission) => {
            return permission === 'granted';
        });
    }

    return Promise.resolve(false);
}

export function sendAlertNotification(alert) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }

    const title = `${alert.symbol} Alert Triggered!`;
    const direction = alert.direction === 'above' ? 'Above' : 'Below';
    const options = {
        body: `${alert.symbol} ${alert.name} has ${direction.toLowerCase()} ₦${Number(alert.targetPrice).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Current: ₦${Number(alert.currentPrice).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: alert.logo || '/logos/NGX.png',
        badge: '/favicon.ico',
        tag: `alert-${alert.id}`,
        requireInteraction: true,
    };

    try {
        new Notification(title, options);
    } catch (error) {
        console.error('Failed to send notification:', error);
    }
}

export function checkAndNotifyAlerts(evaluatedAlerts = []) {
    /**
     * Find newly triggered alerts and send notifications for them.
     * This should be called whenever alerts are re-evaluated.
     */
    const triggeredAlerts = evaluatedAlerts.filter((alert) => alert.triggered);

    triggeredAlerts.forEach((alert) => {
        sendAlertNotification(alert);
    });

    return triggeredAlerts.length;
}
