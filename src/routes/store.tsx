import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/store")({
  staticData: {
    page: {
      key: "store",
      title: "Store",
      sub: "Permanent Gem-shop items. Structure Decks are bought 3 at a time. Limited bundles live under Events.",
    },
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/store"!</div>;
}
