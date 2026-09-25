import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityFeedProps } from "@/lib/types/activity-feed";
import React from "react";
import Link from "next/link";

export default function ActivityFeed({
  activityData,
}: {
  activityData: ActivityFeedProps[];
}) {
  return (
    <Card className="border-2 border-foreground flex-2">
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {activityData.length === 0 ? 
        (<p>No activities found</p>)
        : (activityData
        .sort(
          (a,b)=>
            new Date(b.created_at).getTime()-
            new Date(a.created_at).getTime()
        )
        .map((act) => (
          <div key={act.id} className="flex flex-col gap-2 border border-foreground rounded-lg p-2">
            <Link className="font-semibold hover:underline transition-all" href={act.link}>{act.activity}</Link>
            <time
              dateTime={act.created_at}
              className="text-muted-foreground font-bold"
            >
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(act.created_at))}
            </time>
          </div>
        )))}
      </CardContent>
    </Card>
  );
}
