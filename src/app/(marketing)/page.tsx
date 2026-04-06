"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  MessageSquare,
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  Sparkles,
  Target,
  Award,
} from "lucide-react";

const STEPS = [
  {
    icon: MessageSquare,
    title: "Give Feedback",
    description:
      "Review someone's app, website, or project with structured, meaningful feedback.",
    credit: "+3 credits",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Zap,
    title: "Earn Credits",
    description:
      "Every quality review earns you credits you can spend on your own project.",
    credit: "💎 Credits grow",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: TrendingUp,
    title: "Get Feedback",
    description:
      "Submit your project for community review and collect actionable insights.",
    credit: "-5 credits",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

const FEATURES = [
  {
    icon: Target,
    title: "Structured Reviews",
    description:
      "No fluffy comments. Our feedback form forces reviewers to give actionable, multi-field feedback.",
  },
  {
    icon: Award,
    title: "Gamified Leaderboard",
    description:
      "Top reviewers earn badges. Build your reputation as an active, helpful community member.",
  },
  {
    icon: Sparkles,
    title: "Quality-First",
    description:
      "Anti-spam logic ensures every review meets minimum quality standards before credits are awarded.",
  },
  {
    icon: Users,
    title: "Real Builders",
    description:
      "Connect with indie devs, designers, and founders who actually understand your challenges.",
  },
];

const STATS = [
  { label: "Reviews Given", value: "10K+" },
  { label: "Projects Submitted", value: "2K+" },
  { label: "Active Builders", value: "5K+" },
  { label: "Credits Earned", value: "30K+" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-500/30 text-sm text-violet-300 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Community-powered feedback for builders</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
          >
            Earn Feedback
            <br />
            <span className="gradient-text">By Giving It</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            BuildLoop connects indie makers in a credit exchange loop. Review
            someone's project, earn credits, then submit your own for real,
            structured feedback from real builders.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/sign-up"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl gradient-primary text-white font-semibold text-lg shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-200"
            >
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-border hover:border-violet-500/50 text-foreground font-semibold text-lg hover:bg-secondary transition-all duration-200"
            >
              Explore Projects
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            {["Free to join", "+5 credits on signup", "No credit card"].map(
              (item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  {item}
                </span>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-3xl font-extrabold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              The BuildLoop Growth Loop
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps that create a self-sustaining feedback
              community.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 relative"
          >
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-gradient-to-r from-violet-500/0 via-violet-500/50 to-violet-500/0" />

            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                className="relative bg-card border border-border rounded-2xl p-6 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all"
              >
                <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {i + 1}
                </div>
                <div
                  className={`w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center mb-4`}
                >
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {step.description}
                </p>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${step.bg} ${step.color}`}
                >
                  {step.credit}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Built for Quality Feedback
            </h2>
            <p className="text-muted-foreground text-lg">
              Every feature is designed to drive meaningful, actionable
              insights.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="flex gap-4 p-6 bg-card border border-border rounded-2xl hover:border-violet-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden glass border border-violet-500/20 p-12"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg float">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl font-extrabold mb-4">
                Ready to get real feedback?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands of indie makers helping each other build better
                products.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-primary text-white font-semibold text-lg shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all"
              >
                Join BuildLoop Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-muted-foreground mt-4">
                You get 5 free credits just for signing up
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
