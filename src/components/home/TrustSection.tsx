import { Card } from "../ui/card";

export default function TrustSection() {
  return (
    <>
      <section className="border-t border-[rgb(var(--border))]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Clean UX",
                desc: "Mobile-first layout with accessible components and predictable interactions.",
              },
              {
                title: "Local-first",
                desc: "Most tools run entirely in your browser. No unnecessary uploads.",
              },
              {
                title: "SEO-ready",
                desc: "Each tool has dedicated metadata, canonical URLs and structured data.",
              },
            ].map((x) => (
              <Card
                key={x.title}
                className="p-5 hover:shadow-[var(--shadow-md)] transition"
              >
                <div className="font-medium">{x.title}</div>
                <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                  {x.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
