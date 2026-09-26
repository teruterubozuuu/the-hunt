"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((character) => character.charCodeAt(0)));
}

export default function PushNotificationSettings() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      const supported =
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window;

      setIsSupported(supported);

      if (supported) {
        const registration = await navigator.serviceWorker.ready;
        setIsSubscribed(Boolean(await registration.pushManager.getSubscription()));
      }

      setIsLoading(false);
    };

    checkSubscription().catch(() => setIsLoading(false));
  }, []);

  const subscribe = async () => {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) throw new Error("Push notifications are not configured");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    const response = await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });

    if (!response.ok) throw new Error("Failed to save notification subscription");
    setIsSubscribed(true);
  };

  const unsubscribe = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;

    const response = await fetch("/api/notifications/unsubscribe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });

    if (!response.ok) throw new Error("Failed to remove notification subscription");
    await subscription.unsubscribe();
    setIsSubscribed(false);
  };

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (isSubscribed) await unsubscribe();
      else await subscribe();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) return <p>Push notifications are not supported in this browser.</p>;

  return (
    <Button type="button" onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Checking..." : isSubscribed ? "Disable interview reminders" : "Enable interview reminders"}
    </Button>
  );
}
