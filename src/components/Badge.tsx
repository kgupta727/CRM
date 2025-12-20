"use client";
import clsx from "clsx";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "default";

export default function Badge({ text, variant = "default" }: { text: string; variant?: BadgeVariant }) {
  const classes = clsx(
    "badge",
    variant === "success" && "badge-success",
    variant === "warning" && "badge-warning",
    variant === "danger" && "badge-danger",
    variant === "info" && "badge-info"
  );
  return <span className={classes}>{text}</span>;
}
