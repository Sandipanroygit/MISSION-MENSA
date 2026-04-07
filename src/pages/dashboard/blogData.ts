import {
  hasPersistedContentCollection,
  readContentCollection,
  readRemoteContentCollection,
  saveContentCollection,
  saveRemoteContentCollection,
} from "@/backend/contentStore";

export interface BlogYoutubeBlock {
  type: "youtube";
  url: string;
  title: string;
}

export type BlogContentBlock = string | BlogYoutubeBlock;

export interface BlogEntry {
  slug: string;
  title: string;
  summary: string;
  author: string;
  authorEmail: string;
  image: string;
  content: BlogContentBlock[];
  views?: number;
  likes?: number;
}

export const blogs: BlogEntry[] = [
  {
    slug: "from-announcement-to-calling",
    title:
      "From Announcement to Calling — How My Role in Mission Mensa Changed Everything",
    summary:
      "A field note on how a role that first looked like an assessment assignment became a deeper responsibility toward pedagogy, purpose, and nation building.",
    author: "Dr Sruthi Sridharan",
    authorEmail: "programlead@missionmensa.org",
    views: 184,
    likes: 37,
    image:
      "https://images.unsplash.com/photo-1758270705518-b61b40527e76?auto=format&fit=crop&w=1200&q=80",
    content: [
      "I did not see it coming.",
      "The kickoff meeting was a normal enough setting — a room of colleagues, an agenda, introductions. And then my name was mentioned, not as a participant, but as the lead. I remember the moment clearly, not because I felt proud, but because I felt genuinely puzzled. I was still on probation with the organisation. I had come in as the psychologist. My immediate instinct was practical and, if I am honest, a little deflating: *they've put me in charge because they need someone to do the Mensa assessments. That's the role. That's why it's me.*",
      "It made sense in a neat, transactional way. Mensa — gifted children — psychologist — assessments. A logical chain. I settled into that explanation and carried it for a while.",
      "But something began to shift as the conversations deepened.",
      "Meeting after meeting, the project revealed itself slowly, the way a large painting does when you step back far enough to see the whole canvas. The assessments were not the point. The children were not even the point in the narrow sense I had imagined. The point — the actual, audacious, almost unreasonable point — was **nation building**. The question this project was asking was not *how do we identify gifted children?* but something far larger: *what does school need to become, if it is to build the future?*",
      "That reframe changed everything for me.",
      "There is a particular sensation I can only describe as holding something precious and fragile at the same time. A magic potion, if you will — one that could genuinely alter outcomes if handled with care, and that would be a waste of rare ingredients if fumbled. That is what Mission Mensa began to feel like. Not a project I had been assigned to, but one I had been entrusted with.",
      "**What this surfaces as a research insight** is something I think is underexplored in educational reform work: the journey of the practitioner from *task-holder* to *meaning-maker*. I did not arrive at my sense of ownership through a briefing document or a job description. I arrived at it through sustained dialogue, through being invited into the thinking, through watching the concept grow in the room. That process — of a project revealing its own depth to the people responsible for it — is itself a pedagogy worth documenting.",
      "The excitement is real. So is the responsibility. And underneath both of them sits something quieter: **gratitude**. That I am here at this particular moment, in this particular room, holding this particular question. There is no way this project fails — not because the conditions are perfect, but because the question it is asking is too important to abandon. You do not put down a magic potion halfway through.",
      "We are just getting started.",
    ],
  },
  {
    slug: "what-underprivileged-looks-like-now",
    title: "What Underprivileged Looks Like Now — And Why It Changed Our AI Design",
    summary:
      "A research note on how meeting Mensa-qualified children challenged an old picture of underprivilege and reshaped the AI Tutor design around recognition and rigorous challenge.",
    author: "Dr Sruthi Sridharan",
    authorEmail: "programlead@missionmensa.org",
    views: 142,
    likes: 29,
    image:
      "https://images.pexels.com/photos/8471919/pexels-photo-8471919.jpeg?auto=compress&cs=tinysrgb&w=1200",
    content: [
      "I walked into the first round of screenings carrying a mental image that was, I now realise, approximately thirty years old.",
      "Underprivileged, in the picture I had held for most of my career, looked a particular way. It carried certain markers — hesitance, deference, a kind of learned smallness. Children who had grown up without resources, without the scaffolding of enriched environments, tended — or so I had assumed — to present with a particular tentativeness about their own abilities. They needed to be drawn out. Encouraged. Told they were capable before they could believe it themselves.",
      "That picture did not survive the first meeting with our Mensa-qualified children.",
      "What I encountered instead were children who were — and I want to choose this word carefully — **certain**. Not arrogant. Not performing confidence for an audience. Genuinely, quietly certain. When I spoke with them about their results, about the screening, about what it meant to be Mensa-qualified, more than one of them told me, in their own words, that they were not surprised. They had known. They had always known. The system around them had simply not caught up yet.",
      "That moment landed on me with unexpected weight.",
      "Because what these children were describing was not a lack of resources in the material sense we typically mean. What they were living with was something arguably more difficult: **a surplus of self-knowledge in an environment that consistently underestimated them**. They were outliers who had learned to carry their outlier-ness quietly, not because they doubted themselves, but because they had stopped expecting the world around them to recognise what they already knew about themselves.",
      "Underprivileged, in 2026, looks like being unseen. It looks like being the smartest person in a room that doesn't know how to talk to you.",
      "**This changed everything about how we are designing the AI Tutor.**",
      "Our original conception of an AI learning companion for this cohort leaned heavily on the support scaffolding — fill the resource gap, provide access, compensate for what the environment hadn't given them. That framing, we now understand, was incomplete. It was built on the old picture.",
      "The AI Tutor we are now designing is built around a different understanding of who these children are. Yes, they are Mensa-qualified. But more importantly, they are **built on will and wits**. They have spent years proving things — to teachers who underestimated them, to systems that didn't see them, to classrooms where they were the anomaly no one had a framework for. That experience has forged something in them: a deep, almost defiant need to demonstrate what they are capable of.",
      "An AI that simply *helps* them will not be enough. They don't want to be helped. They want to be **challenged, heard, and met at their actual level** — possibly for the first time in their academic lives.",
      "So the tutor must be designed to do something unusual. It must hold two things simultaneously: the fact that these are exceptionally gifted children, and the fact that their giftedness has been shaped in conditions of being constantly overlooked. The pedagogy that flows from that is not remediation. It is **recognition** — followed immediately by rigorous, respectful challenge.",
      "**What this surfaces as a research insight** is a design principle that I believe has broader implications beyond this cohort: the most dangerous assumption in educational technology is that we know who the learner is before we've actually met them. We came in with a thirty-year-old image of underprivileged. The children dismantled it in a single conversation.",
      "Any learning system — human or AI — that cannot update its model of the learner in real time will, at best, provide the wrong kind of support. At worst, it will replicate the very invisibility these children have spent their whole lives escaping.",
      "We are building something different. Something that sees them first.",
    ],
  },
];
const SEEDED_BLOG_SLUGS = new Set(blogs.map((blog) => blog.slug));

function getFallbackBlogStat(slug: string, offset: number) {
  return slug
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), offset);
}

export function getBlogStats(blog: BlogEntry) {
  return {
    views: blog.views ?? 80 + (getFallbackBlogStat(blog.slug, 17) % 220),
    likes: blog.likes ?? 12 + (getFallbackBlogStat(blog.slug, 7) % 65),
  };
}

export function mergePublishedAndSeedBlogs(publishedBlogs: BlogEntry[]) {
  return [
    ...publishedBlogs.filter((blog) => !SEEDED_BLOG_SLUGS.has(blog.slug)),
    ...blogs,
  ];
}

const LEGACY_PUBLISHED_BLOGS_STORAGE_KEY = "mission-mensa-published-blogs";

function readLegacyPublishedBlogs(): BlogEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(LEGACY_PUBLISHED_BLOGS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as BlogEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getPublishedBlogs(): BlogEntry[] {
  if (hasPersistedContentCollection("publishedBlogs")) {
    return readContentCollection<BlogEntry>("publishedBlogs", []);
  }

  const legacyBlogs = readLegacyPublishedBlogs();
  if (legacyBlogs.length) {
    saveContentCollection("publishedBlogs", legacyBlogs);
  }

  return legacyBlogs;
}

export async function getPublishedBlogsAsync(): Promise<BlogEntry[]> {
  const remoteBlogs = await readRemoteContentCollection<BlogEntry>(
    "publishedBlogs",
    [],
  );

  if (remoteBlogs.length) {
    return remoteBlogs;
  }

  await saveRemoteContentCollection("publishedBlogs", blogs);
  return getPublishedBlogs();
}

export function savePublishedBlog(blog: BlogEntry) {
  const current = getPublishedBlogs();
  const filtered = current.filter((entry) => entry.slug !== blog.slug);
  saveContentCollection("publishedBlogs", [blog, ...filtered]);
}

export async function savePublishedBlogAsync(blog: BlogEntry) {
  const current = await getPublishedBlogsAsync();
  const filtered = current.filter((entry) => entry.slug !== blog.slug);
  await saveRemoteContentCollection("publishedBlogs", [blog, ...filtered]);
}

export function deletePublishedBlog(slug: string) {
  const current = getPublishedBlogs();
  const filtered = current.filter((entry) => entry.slug !== slug);
  saveContentCollection("publishedBlogs", filtered);
}

export async function deletePublishedBlogAsync(slug: string) {
  const current = await getPublishedBlogsAsync();
  const filtered = current.filter((entry) => entry.slug !== slug);
  await saveRemoteContentCollection("publishedBlogs", filtered);
}
