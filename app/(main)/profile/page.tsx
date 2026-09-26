import PushNotificationSettings from "@/components/notifications/push-notification-settings";

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <h1 className="font-bold text-2xl">Profile</h1>
      <section className="space-y-2">
        <h2 className="font-semibold">Interview reminders</h2>
        <p className="text-sm text-muted-foreground">
          Receive reminders 24 hours and 1 hour before scheduled interviews.
        </p>
        <PushNotificationSettings />
      </section>
    </div>
  );
}
