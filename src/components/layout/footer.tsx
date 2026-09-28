import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[rgba(var(--fg),0.05)] bg-[rgba(var(--card),0.3)] pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-6 mb-16">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500 text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
                T
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[rgb(var(--fg))]">ToolMate.</span>
            </Link>
            <p className="text-[14px] text-[rgb(var(--muted))] leading-relaxed max-w-xs mt-2">
              A premium collection of developer utilities. Built for speed, privacy, and frictionless workflows.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[14px] text-[rgb(var(--fg))] tracking-tight">Platform</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/tools" className="text-[14px] text-[rgb(var(--muted))] hover:text-indigo-500 transition-colors">All Tools</Link>
              <Link href="#" className="text-[14px] text-[rgb(var(--muted))] hover:text-indigo-500 transition-colors">Categories</Link>
              <Link href="#" className="text-[14px] text-[rgb(var(--muted))] hover:text-indigo-500 transition-colors">Search</Link>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[14px] text-[rgb(var(--fg))] tracking-tight">Ecosystem</h4>
            <div className="flex flex-col gap-2.5">
              <a href="https://ui.toolmate.co.in" target="_blank" rel="noreferrer" className="text-[14px] text-[rgb(var(--muted))] hover:text-indigo-500 transition-colors">ToolMate UI</a>
              <a href="https://resume.toolmate.co.in" target="_blank" rel="noreferrer" className="text-[14px] text-[rgb(var(--muted))] hover:text-indigo-500 transition-colors">ToolMate Resume</a>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[14px] text-[rgb(var(--fg))] tracking-tight">Legal</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="#" className="text-[14px] text-[rgb(var(--muted))] hover:text-indigo-500 transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-[14px] text-[rgb(var(--muted))] hover:text-indigo-500 transition-colors">Terms of Service</Link>
              <Link href="#" className="text-[14px] text-[rgb(var(--muted))] hover:text-indigo-500 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-[rgba(var(--fg),0.05)] pt-8">
          <p className="text-[13px] text-[rgb(var(--muted))] font-medium">
            © {new Date().getFullYear()} ToolMate. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0 text-[13px] text-[rgb(var(--muted))] font-medium">
            Crafted with precision.
          </div>
        </div>
      </div>
    </footer>
  );
}
