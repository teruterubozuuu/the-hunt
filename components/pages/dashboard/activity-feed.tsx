"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityFeedProps } from "@/lib/types/activity-feed";
import React, { useState } from "react";
import Link from "next/link";

const PAGE_SIZE = 5;

export default function ActivityFeed({
  activityData,
}: {
  activityData: ActivityFeedProps[];
}) {
  const [activities, setActivities] = useState(activityData);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(activityData.length === PAGE_SIZE);

  const handleLoadMore = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/activity-feed?offset=${activities.length}&limit=${PAGE_SIZE}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load activities");
      }

      const result: {
        activities: ActivityFeedProps[];
        hasMore: boolean;
      } = await response.json();

      setActivities((current) => [...current, ...result.activities]);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedActivities = [...activities].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <Card className="border-2 border-foreground flex-2">
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 overflow-y-auto">
        {activities.length === 0 ? (
          <p>No activities found</p>
        ) : (
          sortedActivities.map((act) => (
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
          ))
        )}
        {hasMore && (
          <Button type="button" onClick={handleLoadMore} disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Loading..." : "Load more"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
