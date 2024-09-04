export function cls(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
