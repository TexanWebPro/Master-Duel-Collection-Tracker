import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/other")({
  staticData: {
    page: {
      key: "other",
      title: "Other",
      sub: "Items from missions, Proficiency Tests, Ranked, Duelist Points and campaign codes, grouped by source.",
    },
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/other"!</div>;
}
