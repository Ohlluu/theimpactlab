import type { Metadata } from "next";
import { League_Spartan, Roboto } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theimpactlab.co"),
  title: {
    default: "The Impact Lab — Fundraising Strategy for Nonprofits and Foundations",
    template: "%s · The Impact Lab",
  },
  description:
    "The Impact Lab helps nonprofits and foundations strengthen fundraising, leadership, and organizational capacity. Led by Andrea Porter, fundraising strategist and advisor with 15+ years of experience.",
  keywords: [
    "fundraising consultant",
    "major gifts strategy",
    "nonprofit consulting",
    "board development",
    "foundation capacity building",
    "nonprofit fundraising coach",
    "Andrea Porter",
    "The Impact Lab",
  ],
  authors: [{ name: "Andrea Porter" }],
  openGraph: {
    type: "website",
    siteName: "The Impact Lab",
    title: "The Impact Lab — Fundraising Strategy for Nonprofits and Foundations",
    description:
      "Strategy and implementation for mission-driven organizations building the capacity to raise more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Impact Lab",
    description:
      "Fundraising strategy, major gifts, board development, and leadership coaching for nonprofits and foundations.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${leagueSpartan.variable} ${roboto.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-olive-950 text-paper">
        {children}

        {/* Grain, over everything, interacting with nothing. Fixed rather
            than per-section so the texture stays still while the page
            scrolls — which is how grain behaves on paper, and what stops it
            reading as a moving overlay. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[70] opacity-[0.055] mix-blend-overlay"
          style={{
            backgroundImage: "url(/img/grain.png)",
            backgroundSize: "160px 160px",
          }}
        />
      </body>
    </html>
  );
}
