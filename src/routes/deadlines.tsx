import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/deadlines")({
  staticData: {
    page: {
      key: "deadlines",
      title: "Deadlines",
      sub: "Time-sensitive deadlines plus any event with an end date. Expired and done items move to history.",
    },
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/deadlines"!</div>;
}
