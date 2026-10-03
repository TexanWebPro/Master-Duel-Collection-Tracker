import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../components/views/Dashboard";

export const Route = createFileRoute("/")({
  staticData: {
    page: {
      key: "dashboard",
      title: "Dashboard",
      sub: "Collection state at a glance and what to do next.",
    },
  },
  // loader: ({ context: { queryClient, trpc } }) =>
  //   queryClient.ensureQueryData(trpc.collectibles.list.queryOptions({ section: 'solo' })),
  component: Dashboard,
});
