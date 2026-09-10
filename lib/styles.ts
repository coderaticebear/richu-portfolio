import clsx from "clsx";

const btnBase =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold " +
  "transition-[background-color,color,opacity,transform] duration-150 ease-out " +
  "active:scale-[0.97] " +
  "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2";

export const btnPrimary = clsx(btnBase, "bg-accent text-accent-ink hover:opacity-90");
export const btnSecondary = clsx(
  btnBase,
  "border border-control-border bg-ink/[0.05] text-ink hover:bg-ink/[0.1]",
);
export const btnGhost = clsx(btnBase, "text-ink hover:text-accent-text");

// Animated underline for inline text links — draws in from the left on
// hover/focus, GPU-cheap (transform only), safe for frequent use.
export const underlineLink =
  "relative w-fit after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full " +
  "after:origin-left after:scale-x-0 after:bg-current after:transition-transform " +
  "after:duration-200 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100";
