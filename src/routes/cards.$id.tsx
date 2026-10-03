import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cards/$id")({
  staticData: {
    page: {
      sec: "",
      title: "",
      sub: "",
    },
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/cards/$id"!</div>;
}
