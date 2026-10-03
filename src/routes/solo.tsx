import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/solo")({
  staticData: {
    page: {
      key: "solo",
      title: "Solo",
      sub: "Cards and items in all Solo Mode gates.",
    },
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/solo"!</div>;
}
