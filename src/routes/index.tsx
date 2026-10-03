import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../components/views/Dashboard";
import { PageHeader } from "../components/PageHeader";
import { RouteHeaderMeta } from "../config";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const meta: RouteHeaderMeta = {
    key: "dashboard",
    title: "Dashboard",
    sub: "Collection state at a glance and what to do next.",
  };

  return (
    <>
      <PageHeader meta={meta} />
      <Dashboard />
    </>
  );
}
