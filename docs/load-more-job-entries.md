# Load More Job Entries

The application tracker uses per-status pagination in both Kanban and List views. This keeps the initial page responsive when a user has many job entries in one status.

## How It Works

1. The tracker page fetches the first 10 jobs for each status on the server.
2. The server also requests an exact count for each status.
3. It passes the jobs and a `hasMoreByStatus` map to the client tracker page.
4. Each Kanban column and List section renders its own `Load more` button when its status has additional jobs.
5. Clicking the button requests the next page for that status.
6. New jobs are appended to the shared client array, so both views immediately see the newly loaded entries.
7. The button disappears when the API reports that there are no more jobs.

The statuses are:

- `to-apply`
- `applied`
- `interview`
- `offer`
- `closed`

## Initial Server Fetch

The route at `app/(main)/application-tracker/page.tsx` runs one Supabase query per status:

```text
user_id = current user
status = current status
order by created_at descending
range(0, 19)
```

The result includes an exact count. For example, if the `applied` query returns 10 rows and the count is 47, the client receives:

```ts
hasMoreByStatus.applied === true
```

If the count is 10 or less, that status starts with `false` and does not show a load-more button.

## Load More API

The endpoint is:

```text
GET /api/application-tracker/job-entries
```

Required query parameters:

```text
status=applied
offset=10
limit=10
```

The route authenticates the request, restricts the query to the current user, validates the status, and returns jobs ordered by newest first.

Example response:

```json
{
  "jobs": [],
  "hasMore": true
}
```

The API uses these limits:

- Default page size: 10
- Maximum requested page size: 50
- Offset: never below 0

`hasMore` is calculated from the exact status count:

```text
offset + number of returned jobs < total jobs for status
```

## Client-Side Loading

`ApplicationTrackerPage` owns the shared `items` state. Its `loadMore(status)` function:

1. Counts currently loaded jobs for the requested status.
2. Uses that count as the next API offset.
3. Fetches the next page.
4. Appends jobs while filtering duplicate IDs.
5. Updates `hasMoreByStatus` for that status.

Because the offset is calculated separately for each status, loading more `applied` jobs does not affect pagination for `interview` or any other status.

## Kanban Behavior

Each Kanban column places its `Load more` button below the scrollable job cards. The button only loads jobs for that column's status. While the request is running, the button is disabled and displays `Loading...`.

A failed request leaves the existing cards unchanged and displays an error toast.

## List Behavior

Each List accordion section places its `Load more` button below that section's jobs. The behavior is the same as Kanban, and the loaded jobs are shared with Kanban through the parent tracker state.

The search field is sent to the API for each status, so entries hidden behind pagination can still be found. Search results have their own per-status totals and pagination state. Loading more while searching requests the next page of matching entries, rather than the next page of all entries.

## Related Behavior

- Creating a job appends it to the shared list immediately.
- Deleting a job removes it from the shared list.
- Updating a job replaces the matching item.
- Moving a job to another status updates its status in the shared list, so it moves between columns or sections.
- Switching between Kanban and List does not trigger another fetch because both views use the same loaded items.
