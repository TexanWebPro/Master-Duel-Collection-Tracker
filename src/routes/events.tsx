import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/events")({
  component: RouteComponent,
  staticData: {
    page: {
      key: "events",
      title: "Events",
      sub: "Festivals, Cups and limited-time store campaigns, each with its card and cosmetic items.",
    },
  },
});

function RouteComponent() {
  return <div>Hello "/events"!</div>;
}
