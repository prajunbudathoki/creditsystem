import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const badges = [
    {
      slug: "FAST_FEEDBACK",
      name: "Fast Feedback",
      description: "Gave their first review to a community project.",
      icon: "⚡",
    },
    {
      slug: "COMMUNITY_HELPER",
      name: "Community Helper",
      description: "Gave 5 high-quality reviews.",
      icon: "🤝",
    },
    {
      slug: "TOP_REVIEWER",
      name: "Top Reviewer",
      description: "Gave 20+ helpful reviews. A true pillar of the community.",
      icon: "🏆",
    },
    {
      slug: "UI_CRITIC",
      name: "UI Critic",
      description: "Gave 10 focused UI/UX reviews.",
      icon: "🎨",
    },
    {
      slug: "FIRST_PROJECT",
      name: "First Project",
      description: "Submitted their first project for feedback.",
      icon: "🚀",
    },
    {
      slug: "VETERAN_BUILDER",
      name: "Veteran Builder",
      description: "Submitted 5+ projects to the platform.",
      icon: "🏗️",
    },
  ];
  const users = [
    {
      name: "Prajun",
      email: "prajunbudathoki1@gmail.com",
      image: "https://github.com/prajun100.png",
      onboarded: true,
      credits: 100,
      totalReviews: 0,
    },
    {
      name: "Ram",
      email: "ram@gmail.com",
      image: "https://github.com/prajun100.png",
      onboarded: true,
      credits: 50,
      totalReviews: 0,
      role: "USER",
    },
  ];

  console.log("Seeding badges...");

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug as any },
      update: badge as any,
      create: badge as any,
    });
  }

  console.log("Seeding users...");

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user as any,
      create: user as any,
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
