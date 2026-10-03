import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * shadcn's Sonner wrapper, without next-themes (the app is dark only).
 * Toasts render as small HUD telemetry lines with a live dot.
 */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      duration={1800}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex items-center gap-2.5 rounded-lg border border-primary bg-hud px-3.5 py-2.5 shadow-hud backdrop-blur-xl before:size-1.5 before:shrink-0 before:rounded-full before:bg-primary before:shadow-[0_0_8px_var(--color-primary)] before:content-['']",
          title:
            "font-mono text-xs font-medium tracking-[0.08em] uppercase text-foreground",
        },
      }}
      mobileOffset={{ bottom: 96 }}
      className="toaster group"
      {...props}
    />
  );
}

export { Toaster };
