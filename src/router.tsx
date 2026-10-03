import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { RouteKey } from "./types";

export function getRouter() {
  return createRouter({
    routeTree,
    // context: { queryClient, trpc },
    scrollRestoration: true,
    defaultPreload: "intent",
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
  interface StaticDataRouteOption {
    page: { key: RouteKey; title: string; sub: string };
  }
}
