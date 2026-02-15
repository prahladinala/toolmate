import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEVELOPER } from "@/content/developer";

const avatarSrc =
  typeof DEVELOPER.avatar === "string" &&
  (DEVELOPER.avatar.startsWith("/") || DEVELOPER.avatar.startsWith("http"))
    ? DEVELOPER.avatar
    : "";

export function DeveloperSection() {
  return (
    <section className="border-t border-[rgb(var(--border))]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Card className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-4">
              {/* Square image / placeholder */}
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] shadow-[var(--shadow-sm)]">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt={`${DEVELOPER.name} avatar`}
                    fill
                    sizes="96px"
                    className="object-cover"
                    quality={100}
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-8 w-8 rounded-[10px] bg-[rgba(var(--accent),0.18)]" />
                  </div>
                )}
              </div>

              <div className="max-w-2xl">
                <div className="text-xs text-[rgb(var(--muted))]">
                  Developer
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {DEVELOPER.name}
                </div>

                {/* About: max 2 lines */}
                <p className="mt-2 text-sm text-[rgb(var(--muted))] line-clamp-2">
                  {DEVELOPER.about}
                </p>

                {/* Stack */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {DEVELOPER.stack.map((s) => (
                    <Badge key={s} className="opacity-85">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="min-w-[220px]">
              <div className="text-xs text-[rgb(var(--muted))]">Links</div>
              <div className="mt-2 grid gap-2">
                {DEVELOPER.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      group rounded-[var(--radius)]
                      border border-[rgb(var(--border))] bg-[rgb(var(--card-2))]
                      px-3 py-2 text-sm transition
                      hover:border-[rgba(var(--accent),0.55)] hover:bg-[rgba(var(--accent))]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))]
                      focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]
                      hover:text-[rgb(var(--on-accent))]
                      text-[rgb(var(--fg))] 
                    "
                  >
                    <span className="transition">{l.label}</span>{" "}
                    <span className="text-[rgb(var(--muted))] group-hover:text-[rgb(var(--accent))] transition">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
