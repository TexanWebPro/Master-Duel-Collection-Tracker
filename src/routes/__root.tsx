/// <reference types="vite/client" />
import { Fragment, type ReactNode } from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useMatches,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import Sidebar from "../components/Sidebar";
import { RouteKey } from "../types";
import { PageHeader } from "../components/PageHeader";

// interface RouterContext {
//   queryClient: QueryClient;
//   trpc: typeof trpc;
// }

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Master Duel Collection Tracker" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: () => (
    <RootDocument>
      <Outlet />
    </RootDocument>
  ),
  staticData: {
    page: {
      key: "dashboard",
      title: "",
      sub: "",
    },
  },
});

const counts: Partial<Record<RouteKey, number>> = {
  cards: 14,
  solo: 10,
  store: 10,
  other: 10,
  events: 4,
  deadlines: 5,
};

function RootDocument({ children }: { children: ReactNode }) {
  const matches = useMatches();
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="bg-hud-grid grid min-h-screen grid-cols-1 md:grid-cols-[232px_minmax(0,1fr)]">
          <Sidebar counts={counts} />
          <main className="w-full max-w-360 min-w-0 px-4 pt-4 pb-28 md:px-8 md:pt-7 md:pb-12">
            {matches.map((match) => (
              <Fragment key={match.id}>
                <PageHeader meta={match.staticData.page} />
              </Fragment>
            ))}
            {children}
          </main>
          <Scripts />
        </div>
      </body>
    </html>
  );
}
