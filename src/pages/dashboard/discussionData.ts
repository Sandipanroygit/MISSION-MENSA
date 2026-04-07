import {
  hasPersistedContentCollection,
  readContentCollection,
  readRemoteContentCollection,
  saveContentCollection,
  saveRemoteContentCollection,
} from "@/backend/contentStore";

export type MediaType = "image" | "video";

export interface DiscussionMedia {
  id: string;
  type: MediaType;
  url: string;
  name: string;
}

export interface DiscussionComment {
  id: string;
  authorName: string;
  authorEmail: string;
  body: string;
  createdAt: string;
  attachments: DiscussionMedia[];
  replyToCommentId?: string;
}

export interface DiscussionTopic {
  id: string;
  title: string;
  category?: string;
  body: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  attachments: DiscussionMedia[];
  comments: DiscussionComment[];
}

export const STORAGE_KEY = "mission-mensa-discussions";
export const DISCUSSION_FALLBACK_IMAGE =
  "https://images.pexels.com/photos/32556797/pexels-photo-32556797.jpeg?auto=compress&cs=tinysrgb&w=1200";
export const DISCUSSION_CATEGORY_OPTIONS = [
  "MENSA",
  "Outreach",
  "AI Learning",
  "Mentorship",
  "Assessment",
  "Research",
  "General",
];

export function getDiscussionCategory(topic: DiscussionTopic) {
  return topic.category?.trim() || "General";
}

export const defaultDiscussionTopics: DiscussionTopic[] = [
  {
    id: "student-employability-startups",
    title: "Student Employability & Startups",
    category: "MENSA",
    body: "Exploring what meaningful startups 17-18-year-olds can realistically build, and defining the concept of a Minimum Viable Startup (MVS). This includes designing a clear pathway from idea generation to prototyping and incubation.",
    authorName: "Mission MENSA",
    authorEmail: "team@missionmensa.org",
    createdAt: "2026-04-06T09:00:00.000Z",
    attachments: [
      {
        id: "student-employability-startups-cover",
        type: "image",
        url: "https://images.pexels.com/photos/6914058/pexels-photo-6914058.jpeg?auto=compress&cs=tinysrgb&w=1200",
        name: "Startup team brainstorming around a laptop",
      },
    ],
    comments: [
      {
        id: "student-startups-comment-1",
        authorName: "Ananya Rao",
        authorEmail: "ananya.rao@example.com",
        body: "For Mission MENSA, the startup pathway should begin from the children's lived context. If an underprivileged gifted student uses AI to study, the first startup idea could solve a real learning gap they have personally experienced.",
        createdAt: "2026-04-06T10:00:00.000Z",
        attachments: [],
      },
      {
        id: "student-startups-comment-2",
        authorName: "Rahul Menon",
        authorEmail: "rahul.menon@example.com",
        body: "Yes. The Minimum Viable Startup should not be about building a company immediately. It should help them identify a problem, use AI to research it, test a small solution, and learn how to explain the value clearly.",
        createdAt: "2026-04-06T10:08:00.000Z",
        attachments: [],
        replyToCommentId: "student-startups-comment-1",
      },
      {
        id: "student-startups-comment-3",
        authorName: "Meera Iyer",
        authorEmail: "meera.iyer@example.com",
        body: "A possible pathway: student notices a learning difficulty in their school or community, discusses it with the AI companion, interviews five peers, builds a paper or no-code prototype, and presents what changed after testing.",
        createdAt: "2026-04-06T10:16:00.000Z",
        attachments: [],
      },
      {
        id: "student-startups-comment-5",
        authorName: "Arjun Nair",
        authorEmail: "arjun.nair@example.com",
        body: "Can we define the MVS in four stages? 1. Problem from lived experience. 2. AI-supported research. 3. Prototype with minimum resources. 4. Mentor review on usefulness, ethics, and student ownership.",
        createdAt: "2026-04-06T10:32:00.000Z",
        attachments: [],
      },
      {
        id: "student-startups-comment-6",
        authorName: "Kavya S",
        authorEmail: "kavya.s@example.com",
        body: "I like this. We should also track whether the student is becoming more confident and self-directed, not just whether the prototype works. Mission MENSA is about developing the child, not only the product.",
        createdAt: "2026-04-06T10:40:00.000Z",
        attachments: [],
        replyToCommentId: "student-startups-comment-5",
      },
    ],
  },
  {
    id: "orchestrating-collective-intelligence",
    title: "Orchestrating Collective Intelligence",
    category: "AI Learning",
    body: "Defining who orchestrates the interaction between Human Intelligence, AI, Personal AI Companion, and Networked Intelligence. This includes identifying required skills and determining whether a single mentor can manage multiple students or if distributed roles are needed.",
    authorName: "Mission MENSA",
    authorEmail: "team@missionmensa.org",
    createdAt: "2026-04-06T09:05:00.000Z",
    attachments: [
      {
        id: "orchestrating-collective-intelligence-cover",
        type: "image",
        url: "https://images.pexels.com/photos/7876755/pexels-photo-7876755.jpeg?auto=compress&cs=tinysrgb&w=1200",
        name: "Team coordinating ideas around a shared laptop",
      },
    ],
    comments: [],
  },
  {
    id: "ai-agent-development",
    title: "AI Agent Development",
    category: "AI Learning",
    body: "Establishing a core team to build essential AI agents such as subject tutors, research assistants, and reflective agents. Evaluating domain-specific vs. general-purpose agents, while leveraging LLMs as initial barefoot agents for rapid deployment.",
    authorName: "Mission MENSA",
    authorEmail: "team@missionmensa.org",
    createdAt: "2026-04-06T09:10:00.000Z",
    attachments: [
      {
        id: "ai-agent-development-cover",
        type: "image",
        url: "https://images.pexels.com/photos/1921326/pexels-photo-1921326.jpeg?auto=compress&cs=tinysrgb&w=1200",
        name: "Developer writing code for AI agent development",
      },
    ],
    comments: [],
  },
  {
    id: "role-of-the-human-mentor",
    title: "Role of the Human Mentor",
    category: "Mentorship",
    body: "Redefining the role of mentors in an AI-driven system - focusing on discipline, purpose, ethics, and emotional development. This includes identifying measurable indicators of mentor impact beyond academic outcomes.",
    authorName: "Mission MENSA",
    authorEmail: "team@missionmensa.org",
    createdAt: "2026-04-06T09:15:00.000Z",
    attachments: [
      {
        id: "role-of-the-human-mentor-cover",
        type: "image",
        url: "https://images.pexels.com/photos/18870246/pexels-photo-18870246.jpeg?auto=compress&cs=tinysrgb&w=1200",
        name: "Mentor in one-on-one discussion with a student",
      },
    ],
    comments: [],
  },
  {
    id: "balancing-acceleration-with-humanization",
    title: "Balancing Acceleration with Humanization",
    category: "Mentorship",
    body: "Ensuring that rapid AI-driven learning does not outpace human development. This involves designing the right balance between learning, reflection, and personal growth, while identifying early warning signs of over-acceleration.",
    authorName: "Mission MENSA",
    authorEmail: "team@missionmensa.org",
    createdAt: "2026-04-06T09:20:00.000Z",
    attachments: [
      {
        id: "balancing-acceleration-with-humanization-cover",
        type: "image",
        url: "https://images.pexels.com/photos/7396389/pexels-photo-7396389.jpeg?auto=compress&cs=tinysrgb&w=1200",
        name: "Teacher supporting a student emotionally",
      },
    ],
    comments: [],
  },
  {
    id: "measuring-success",
    title: "Measuring Success",
    category: "Assessment",
    body: "Defining a focused set of metrics to evaluate the experiment, including academic acceleration, student agency, innovation output, and quality of AI collaboration. Establishing clear success and failure criteria for Year 1.",
    authorName: "Mission MENSA",
    authorEmail: "team@missionmensa.org",
    createdAt: "2026-04-06T09:25:00.000Z",
    attachments: [
      {
        id: "measuring-success-cover",
        type: "image",
        url: "https://images.pexels.com/photos/7109316/pexels-photo-7109316.jpeg?auto=compress&cs=tinysrgb&w=1200",
        name: "Analytics dashboard for measuring outcomes",
      },
    ],
    comments: [],
  },
  {
    id: "irreplaceable-role-of-humans-in-education",
    title: "Irreplaceable Role of Humans in Education",
    category: "Research",
    body: "Understanding what remains uniquely human in education when AI handles knowledge delivery. This insight will shape mentor roles, Human Lab design, and the long-term architecture of future schools.",
    authorName: "Mission MENSA",
    authorEmail: "team@missionmensa.org",
    createdAt: "2026-04-06T09:30:00.000Z",
    attachments: [
      {
        id: "irreplaceable-role-of-humans-in-education-cover",
        type: "image",
        url: "https://images.pexels.com/photos/8419196/pexels-photo-8419196.jpeg?auto=compress&cs=tinysrgb&w=1200",
        name: "Teacher guiding students in a classroom discussion",
      },
    ],
    comments: [],
  },
  {
    id: "multilingual-ai-capability",
    title: "Multilingual AI Capability",
    category: "Outreach",
    body: "Ensuring AI systems can operate effectively in regional Indian languages without compromising quality, consistency, or trackability, making the model scalable and inclusive.",
    authorName: "Mission MENSA",
    authorEmail: "team@missionmensa.org",
    createdAt: "2026-04-06T09:35:00.000Z",
    attachments: [
      {
        id: "multilingual-ai-capability-cover",
        type: "image",
        url: "https://images.pexels.com/photos/6936079/pexels-photo-6936079.jpeg?auto=compress&cs=tinysrgb&w=1200",
        name: "Students using mobile technology in a language classroom",
      },
    ],
    comments: [],
  },
];
const DUMMY_DISCUSSION_TOPIC_IDS = new Set([
  "ai-learning-ethics",
  "future-skills-discussion",
  "money-habits-children",
]);

function removeDummyTopics(topics: DiscussionTopic[]) {
  return topics.filter((topic) => !DUMMY_DISCUSSION_TOPIC_IDS.has(topic.id));
}

function mergeDefaultTopics(topics: DiscussionTopic[]) {
  const realTopics = removeDummyTopics(topics);
  const existingTopics = new Map(realTopics.map((topic) => [topic.id, topic]));
  const defaultIds = new Set(defaultDiscussionTopics.map((topic) => topic.id));
  return [
    ...defaultDiscussionTopics.map((topic) => {
      const existingTopic = existingTopics.get(topic.id);
      return existingTopic
        ? { ...topic, comments: existingTopic.comments }
        : topic;
    }),
    ...realTopics.filter((topic) => !defaultIds.has(topic.id)),
  ];
}

export function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

export function getStoredTopics() {
  if (hasPersistedContentCollection("discussionTopics")) {
    return mergeDefaultTopics(
      readContentCollection<DiscussionTopic>("discussionTopics", []),
    );
  }

  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedTopics = window.localStorage.getItem(STORAGE_KEY);
    if (!storedTopics) {
      return [];
    }

    const parsedTopics = JSON.parse(storedTopics) as DiscussionTopic[];
    if (!Array.isArray(parsedTopics)) {
      return [];
    }

    const mergedTopics = mergeDefaultTopics(parsedTopics);
    saveStoredTopics(mergedTopics);
    return mergedTopics;
  } catch {
    return [];
  }
}

export async function getStoredTopicsAsync() {
  const remoteTopics = await readRemoteContentCollection<DiscussionTopic>(
    "discussionTopics",
    [],
  );

  if (remoteTopics.length) {
    return mergeDefaultTopics(remoteTopics);
  }

  const seededTopics = mergeDefaultTopics(getStoredTopics());
  await saveRemoteContentCollection("discussionTopics", seededTopics);
  return seededTopics;
}

export function getPublicTopics() {
  if (hasPersistedContentCollection("discussionTopics")) {
    return getStoredTopics();
  }

  const storedTopics = getStoredTopics();
  if (storedTopics.length) {
    return storedTopics;
  }

  return mergeDefaultTopics([]);
}

export async function getPublicTopicsAsync() {
  return getStoredTopicsAsync();
}

export function saveStoredTopics(topics: DiscussionTopic[]) {
  saveContentCollection("discussionTopics", topics);
}

export async function saveStoredTopicsAsync(topics: DiscussionTopic[]) {
  await saveRemoteContentCollection("discussionTopics", mergeDefaultTopics(topics));
}

export function getTopicCoverImage(topic: DiscussionTopic) {
  return (
    topic.attachments.find((attachment) => attachment.type === "image")?.url ??
    DISCUSSION_FALLBACK_IMAGE
  );
}
