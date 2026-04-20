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
  "https://images.pexels.com/photos/3231359/pexels-photo-3231359.jpeg?auto=compress&cs=tinysrgb&w=1200";
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
        url: "https://images.pexels.com/photos/16070143/pexels-photo-16070143.jpeg?auto=compress&cs=tinysrgb&w=1200",
        name: "Indian students collaborating on a laptop project",
      },
    ],
    comments: [],
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
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Students%20at%20a%20school%20in%20Bangalore%2C%20India%20learning%20to%20code%20on%20Progate.jpg",
        name: "Indian students learning together on computers in Bangalore",
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
        name: "Mentor in one-on-one guidance with a student",
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
        url: "https://images.pexels.com/photos/18012462/pexels-photo-18012462.jpeg?auto=compress&cs=tinysrgb&w=1200",
        name: "Indian children in a classroom focused on human learning context",
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
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/A%20class%20test%20in%20Shahid%20Matangini%20Hazra%20Government%20College%20for%20Women%2C%20West%20Bengal%2C%20India%20%282016%29.jpg",
        name: "Indian students writing a class test in West Bengal",
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
        url: "https://images.pexels.com/photos/35152622/pexels-photo-35152622.jpeg?auto=compress&cs=tinysrgb&w=1200",
        name: "Children in a rural Indian classroom learning together",
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
        url: "https://images.pexels.com/photos/34030121/pexels-photo-34030121.jpeg?auto=compress&cs=tinysrgb&w=1200",
        name: "Smartphone language selection interface for multilingual capability",
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

const REMOVED_DISCUSSION_COMMENT_IDS = new Set([
  "student-startups-comment-1",
  "student-startups-comment-2",
  "student-startups-comment-3",
  "student-startups-comment-5",
  "student-startups-comment-6",
]);

function removeDummyTopics(topics: DiscussionTopic[]) {
  return topics.filter((topic) => !DUMMY_DISCUSSION_TOPIC_IDS.has(topic.id));
}

function sanitizeTopic(topic: DiscussionTopic): DiscussionTopic {
  return {
    ...topic,
    comments: topic.comments.filter(
      (comment) => !REMOVED_DISCUSSION_COMMENT_IDS.has(comment.id),
    ),
  };
}

function mergeDefaultTopics(topics: DiscussionTopic[]) {
  const realTopics = removeDummyTopics(topics).map(sanitizeTopic);
  const existingTopics = new Map(realTopics.map((topic) => [topic.id, topic]));
  const defaultIds = new Set(defaultDiscussionTopics.map((topic) => topic.id));
  return [
    ...defaultDiscussionTopics.map((topic) => {
      const existingTopic = existingTopics.get(topic.id);
      return sanitizeTopic(
        existingTopic
        ? { ...topic, comments: existingTopic.comments }
        : topic,
      );
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
  const localTopics = getStoredTopics();
  const remoteTopics = await readRemoteContentCollection<DiscussionTopic>(
    "discussionTopics",
    localTopics,
  );

  const mergedTopics = mergeDefaultTopics(
    Array.from(
      new Map(
        [...localTopics, ...remoteTopics].map((topic) => [topic.id, topic]),
      ).values(),
    ),
  );

  saveContentCollection("discussionTopics", mergedTopics);
  return mergedTopics;
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
