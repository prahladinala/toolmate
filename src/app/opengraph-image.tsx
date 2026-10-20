import { ImageResponse } from "next/og";

export const alt = "ToolMate - Prahlad Inala";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          backgroundColor: "#090d16",
          backgroundImage:
            "linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e1b4b 100%)",
          position: "relative",
          padding: "60px 80px",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top Glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "200px",
            width: "800px",
            height: "300px",
            background: "linear-gradient(180deg, rgba(99,102,241,0.25) 0%, transparent 100%)",
          }}
        />

        {/* Central Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 60px",
            background: "rgba(15, 23, 42, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "32px",
            width: "100%",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 24px",
              background: "rgba(99, 102, 241, 0.18)",
              border: "1px solid rgba(129, 140, 248, 0.4)",
              borderRadius: "9999px",
              color: "#c7d2fe",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.12em",
              marginBottom: 28,
            }}
          >
            60+ FREE DEVELOPER TOOLS
          </div>

          {/* Site Title */}
          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: 20,
              letterSpacing: "-0.03em",
              textAlign: "center",
            }}
          >
            ToolMate
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              color: "#94a3b8",
              lineHeight: 1.45,
              fontWeight: 400,
              maxWidth: "880px",
              textAlign: "center",
            }}
          >
            Fast, private, browser-based developer tools by Prahlad Inala. Format, convert, generate, and calculate instantly.
          </div>
        </div>

        {/* Branding Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "32px",
            padding: "0 10px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 26,
                fontWeight: 900,
                marginRight: "14px",
              }}
            >
              T
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.02em",
              }}
            >
              ToolMate
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 500,
                color: "#64748b",
                marginLeft: "12px",
              }}
            >
              by Prahlad Inala
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 20,
              fontWeight: 600,
              color: "#818cf8",
            }}
          >
            toolmate.co.in
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
