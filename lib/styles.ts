import clsx from "clsx";

const btnBase =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2";

export const btnPrimary = clsx(btnBase, "bg-accent text-accent-ink hover:opacity-90");
export const btnSecondary = clsx(
  btnBase,
  "border border-hairline-strong text-ink hover:bg-surface",
);
export const btnGhost = clsx(btnBase, "text-ink hover:text-accent-text");
