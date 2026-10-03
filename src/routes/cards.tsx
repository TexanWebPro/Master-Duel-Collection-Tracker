import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cards")({
  staticData: {
    page: {
      key: "cards",
      title: "Cards",
      sub: "One copy of every distinct Master Duel card. Owning any art or finish counts. Neon frame = in a deck, do not dismantle.",
    },
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/cards"!</div>;
}
