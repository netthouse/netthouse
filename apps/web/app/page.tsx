export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: "4rem", maxWidth: 720, margin: "0 auto" }}>
      <h1>Netthouse</h1>
      <p>Clearing and cost-attribution layer for AI agents.</p>
      <p>
        API health check:{" "}
        <a href="http://localhost:3001/health" target="_blank">
          http://localhost:3001/health
        </a>
      </p>
    </main>
  );
}