import { getProjects } from "@/actions/project.actions";
import { ProjectCard } from "@/components/projects/ProjectCard";
import {
  Zap,
  ArrowRight,
  MessageSquare,
  Trophy,
  Rocket,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const featuredProjects = await getProjects("featured", 3);

  return (
    <div className="flex flex-col gap-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-primary text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span>The builder community is live!</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1] text-foreground">
            Build Faster. <br />
            Get <span className="text-primary">Real Feedback</span>.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
            Join the community of makers sharing their progress. Give critiques,
            earn credits, and get your project noticed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/10 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-border bg-card font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
            >
              Explore Projects
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats / Social Proof */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Community Makers", value: "2.5k+" },
            { label: "Reviews Given", value: "15k+" },
            { label: "Credits Earned", value: "85k+" },
            { label: "Success Stories", value: "400+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-2xl glass border border-white/5"
            >
              <div className="text-xl md:text-2xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How it Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A simple credit-based economy designed to help builders grow
              together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step numbers bg */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px border-t-2 border-dashed border-border -z-10 -translate-y-1/2" />

            {[
              {
                title: "1. Give Feedback",
                desc: "Review projects on the explore page. The more detailed your feedback, the more you earn.",
                icon: MessageSquare,
                color: "bg-emerald-500/10 text-emerald-400",
                shadow: "shadow-emerald-500/10",
              },
              {
                title: "2. Earn Credits",
                desc: "Credits are the currency of BuildLoop. Earn them by helping others improve their work.",
                icon: Trophy,
                color: "bg-amber-500/10 text-amber-400",
                shadow: "shadow-amber-500/10",
              },
              {
                title: "3. Boost Your Project",
                desc: "Spend your hard-earned credits to submit your project and get featured on the front page.",
                icon: Rocket,
                color: "bg-violet-500/10 text-violet-400",
                shadow: "shadow-violet-500/10",
              },
            ].map((step) => (
              <div
                key={step.title}
                className={`bg-card border border-border p-8 rounded-3xl group hover:border-primary/30 transition-all ${step.shadow} hover:shadow-xl`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Showcase */}
      {featuredProjects.length > 0 && (
        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                  Featured Builds
                </h2>
                <p className="text-muted-foreground mt-2">
                  Hand-picked projects from our community.
                </p>
              </div>
              <Link
                href="/explore"
                className="group flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors"
              >
                View all projects
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="px-4">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute inset-0 gradient-primary rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="relative glass border border-white/10 rounded-[2.5rem] p-8 md:p-16 text-center overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
              Ready to ship your <br className="hidden md:block" />
              next big idea?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto font-medium">
              Join thousands of indie makers building in public and improving
              their products through community feedback.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-white text-black font-bold hover:scale-105 transition-transform"
            >
              Join BuildLoop Today
              <Rocket className="w-5 h-5" />
            </Link>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground opacity-50 grayscale">
              <div className="flex items-center gap-2 text-sm font-bold">
                <ShieldCheck className="w-5 h-5" />
                SECURE AUTH
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Zap className="w-5 h-5" />
                FAST FEEDBACK
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Trophy className="w-5 h-5" />
                TOP RANKINGS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 border-t border-border pt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pb-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight">
                Build<span className="gradient-text">Loop</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-xs text-center md:text-left">
              The feedback exchange platform for digital builders. Build, ship,
              and iterate with community support.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {["Explore", "Leaderboard", "Submit", "Sign In", "Privacy"].map(
              (link) => (
                <Link
                  key={link}
                  href={`/${link.toLowerCase().replace(" ", "-")}`}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </Link>
              ),
            )}
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-border py-8 text-center sm:text-left">
          <p className="text-[10px] text-muted-foreground">
            © 2026 BuildLoop. Built for builders by Prajun. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
