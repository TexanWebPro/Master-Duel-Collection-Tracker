import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/other")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/other"!</div>;
}
