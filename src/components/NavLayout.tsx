import Navigation from "./Navigation";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1 }}>{children}</div>
      <Navigation />
    </div>
  );
}
