import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/deadlines")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/deadlines"!</div>;
}
