import NavLayout from "@/components/NavLayout";

export default function SubpageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavLayout>{children}</NavLayout>;
}
