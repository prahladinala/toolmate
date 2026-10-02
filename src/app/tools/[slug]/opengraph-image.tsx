import { ImageResponse } from "next/og";
import { getTool } from "@/features/tools/registry";

export const runtime = "edge";
export const alt = "ToolMate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);

  if (!tool) {
    return new ImageResponse(
      (
        <div style={{ fontSize: 64, background: "white", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          ToolMate
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d1117",
          backgroundImage: "radial-gradient(circle at -10% -20%, rgba(99,102,241,0.4) 0%, transparent 60%), radial-gradient(circle at 110% 120%, rgba(168,85,247,0.3) 0%, transparent 60%)",
          position: "relative",
          padding: "0 80px",
        }}
      >
        {/* Background Grid Pattern (simulated with CSS) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating Glassmorphic Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 60px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "2px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "40px",
            boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
            width: "100%",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "12px 32px",
              background: "rgba(99, 102, 241, 0.15)",
              border: "2px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "50px",
              color: "#a5b4fc",
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 48,
            }}
          >
            {tool.category}
          </div>

          <div
            style={{
              fontSize: 84,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: 32,
              letterSpacing: "-0.02em",
            }}
          >
            {tool.name}
          </div>

          <div
            style={{
              fontSize: 38,
              color: "#94a3b8",
              lineHeight: 1.5,
              fontWeight: 500,
              maxWidth: "800px",
            }}
          >
            {tool.shortDescription}
          </div>
        </div>

        {/* Branding Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 32,
              fontWeight: 900,
              marginRight: "16px",
            }}
          >
            T
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            toolmate
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
