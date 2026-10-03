import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import type { VariantProps } from "class-variance-authority";

import { toggleVariants } from "./toggle";
import { cn } from "../../lib/utils";

type ToggleVariant = NonNullable<
  VariantProps<typeof toggleVariants>["variant"]
>;

const ToggleGroupContext = React.createContext<{ variant: ToggleVariant }>({
  variant: "segment",
});

type RootProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root>;
type SingleRootProps = Extract<RootProps, { type: "single" }>;
type MultipleRootProps = Extract<RootProps, { type: "multiple" }>;

type ToggleGroupProps = (
  | (Omit<SingleRootProps, "type"> & { type?: "single" })
  | MultipleRootProps
) & { variant?: ToggleVariant };

/**
 * Segmented control. For type="single" (the default), Radix emits "" when the active
 * item is clicked again; `onValueChange` here ignores that so one segment is always on.
 */
function ToggleGroup({
  className,
  variant = "segment",
  children,
  ...props
}: ToggleGroupProps) {
  const rootClassName = cn(
    "inline-flex w-fit items-center",
    variant === "segment" &&
      "overflow-hidden rounded-md border border-tactical/80",
    variant === "chip" && "flex-wrap gap-2",
    className,
  );
  const content = (
    <ToggleGroupContext.Provider value={{ variant }}>
      {children}
    </ToggleGroupContext.Provider>
  );

  if (props.type === "multiple") {
    return (
      <ToggleGroupPrimitive.Root
        data-slot="toggle-group"
        className={rootClassName}
        {...props}
      >
        {content}
      </ToggleGroupPrimitive.Root>
    );
  }

  const { onValueChange, ...singleProps } = props;
  const handleValueChange = onValueChange
    ? (value: string) => {
        if (value) onValueChange(value);
      }
    : undefined;

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={rootClassName}
      {...singleProps}
      type="single"
      onValueChange={handleValueChange}
    >
      {content}
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({ variant: variant ?? context.variant }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
