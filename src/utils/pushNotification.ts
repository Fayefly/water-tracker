export async function registerPushNotification(userId: string): Promise<boolean> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("[Push] Not supported in this browser");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log("[Push] Permission:", permission);
    if (permission !== "granted") return false;

    await navigator.serviceWorker.register("/sw.js");
    const ready = await navigator.serviceWorker.ready;
    console.log("[Push] SW ready");

    const res = await fetch("/api/push/vapid-key");
    const { publicKey } = await res.json();
    if (!publicKey) {
      console.log("[Push] No VAPID key from server");
      return false;
    }

    // Use existing subscription if available, otherwise create new
    let subscription = await ready.pushManager.getSubscription();
    console.log("[Push] Existing subscription:", subscription ? "yes" : "no");

    if (!subscription) {
      subscription = await ready.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      console.log("[Push] New subscription created");
    }

    // Send to server
    const resp = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, subscription: subscription.toJSON() }),
    });
    const result = await resp.json();
    console.log("[Push] Saved to server:", result);

    return true;
  } catch (err) {
    console.error("[Push] Registration failed:", err);
    return false;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
