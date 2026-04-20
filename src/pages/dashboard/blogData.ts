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

export interface BlogPdfBlock {
  type: "pdf";
  url: string;
  title: string;
}

export interface BlogTableBlock {
  type: "table";
  title: string;
  headers: string[];
  rows: string[][];
}

export interface BlogHeadingBlock {
  type: "heading";
  level: 1 | 2 | 3;
  text: string;
}

export interface BlogComment {
  id: string;
  authorName: string;
  authorEmail: string;
  body: string;
  createdAt: string;
}

export type BlogContentBlock =
  | string
  | BlogYoutubeBlock
  | BlogPdfBlock
  | BlogTableBlock
  | BlogHeadingBlock;

export interface BlogEntry {
  slug: string;
  title: string;
  summary: string;
  author: string;
  authorEmail: string;
  image: string;
  content: BlogContentBlock[];
  viewCount?: number;
  likedBy?: string[];
  comments?: BlogComment[];
}

export const DEFAULT_BLOG_COVER_IMAGES = [
  "https://upload.wikimedia.org/wikipedia/commons/6/63/Students_at_a_school_in_Bangalore%2C_India_learning_to_code_on_Progate.jpg",
];

export function getDefaultBlogCover(seed: string) {
  const normalizedSeed = seed.trim().toLowerCase() || "mission-mensa";
  const index =
    normalizedSeed
      .split("")
      .reduce((total, character) => total + character.charCodeAt(0), 0) %
    DEFAULT_BLOG_COVER_IMAGES.length;

  return DEFAULT_BLOG_COVER_IMAGES[index];
}

function normalizeBlogEntry(blog: BlogEntry): BlogEntry {
  const normalizedComments = Array.isArray(blog.comments)
    ? blog.comments
        .filter(
          (comment): comment is BlogComment =>
            Boolean(
              comment &&
                typeof comment.id === "string" &&
                typeof comment.authorName === "string" &&
                typeof comment.authorEmail === "string" &&
                typeof comment.body === "string" &&
                typeof comment.createdAt === "string",
            ),
        )
        .map((comment) => ({
          id: comment.id,
          authorName: comment.authorName.trim() || "User",
          authorEmail: comment.authorEmail.trim().toLowerCase(),
          body: comment.body.trim(),
          createdAt: comment.createdAt,
        }))
        .filter((comment) => Boolean(comment.body))
    : [];

  return {
    ...blog,
    image:
      typeof blog.image === "string" && blog.image.trim().length > 0
        ? blog.image
        : getDefaultBlogCover(blog.slug || blog.title),
    viewCount:
      typeof blog.viewCount === "number"
        ? blog.viewCount
        : typeof (blog as BlogEntry & { views?: number }).views === "number"
        ? (blog as BlogEntry & { views?: number }).views
        : 0,
    likedBy: Array.isArray(blog.likedBy)
      ? Array.from(
          new Set(
            blog.likedBy
              .filter((value): value is string => typeof value === "string")
              .map((value) => value.trim().toLowerCase())
              .filter(Boolean),
          ),
        )
      : [],
    comments: normalizedComments,
  };
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
      "https://upload.wikimedia.org/wikipedia/commons/6/69/Classroom_in_India.jpg",
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
      "https://upload.wikimedia.org/wikipedia/commons/e/e6/5th_grade_Indian_students.jpg",
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
  {
    slug: "the-intelligence-beneath-the-surface",
    title: "The Intelligence Beneath the Surface",
    summary:
      "A reflective note on the difference between talent, interest, and intelligence, and why adaptive pattern-seeking may be the clearest signal of giftedness.",
    author: "Dr Sruthi Sridharan",
    authorEmail: "programlead@missionmensa.org",
    views: 118,
    likes: 22,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e6/5th_grade_Indian_students.jpg",
    content: [
      "I've been thinking a lot about intelligence lately, not the kind we measure in exams or celebrate in report cards, but something quieter, more fundamental.",
      "We use words like intelligent, talented, and passionate almost interchangeably. I've done it too. But the more I observe children, and honestly adults, the more I feel these words are pointing to very different things.",
      "Talent is specific.",
      "A child who can pick up a melody instantly, or move with natural athletic ease, that's talent. It lives in a domain. Take away the domain, and the talent has nowhere to express itself.",
      "Interest is different.",
      "It's the pull. The child who sits with a puzzle for hours, or keeps coming back to the same topic, that's interest. But interest doesn't guarantee ability, and it certainly doesn't guarantee intelligence.",
      "Intelligence, I'm beginning to realise, is something else entirely.",
      "It's the ability to walk into a situation you've never seen before, notice what's changing and what's constant, figure out the underlying rule, and respond. It's not what you know. It's how you deal with what you don't know.",
      "This matters to me now because I've seen how easily we get this wrong.",
      "We reward children who perform well in familiar structures, those who read early, speak fluently, or score high. And we assume that's intelligence. But I've also seen children who don't shine in these environments, yet do something remarkable when faced with something new: they figure it out.",
      "That ability, the ability to adapt, is what stays with a person. It travels across contexts. And in a world that keeps changing, that feels far more valuable than any fixed skill.",
      "At some point, I stopped looking only at humans.",
      "Think of a lizard when the temperature drops. It doesn't fight the cold. It slows down, conserves energy, and waits. Now think of a bird facing the same problem. It doesn't conserve, it migrates, sometimes across thousands of kilometres.",
      "Same problem. Completely different responses.",
      "Neither is stronger or faster than many other animals. But both survive because they are responding appropriately to their environment.",
      "I don't mean to say they are reasoning the way humans do. Much of this is instinct shaped over time. But what struck me is this: survival, at its core, depends on fit. On responding to what the environment is asking of you.",
      "And when I look at intelligence through that lens, it starts to feel less like a score and more like a kind of underlying logic.",
      "So what are we really measuring?",
      "This is where something like Raven's Progressive Matrices makes sense to me.",
      "There are no words. No memorised knowledge. Just patterns you've never seen before, and a missing piece.",
      "All you can do is:",
      "look carefully",
      "figure out what's changing",
      "infer the rule",
      "apply it",
      "That's it.",
      "It's probably the closest I've seen to isolating that engine of thinking, the ability to deal with the new.",
      "It's not perfect. No test is. But it asks a very different question from most of what we usually ask.",
      "If intelligence is really about this ability to perceive patterns and adapt, then I suspect it's far more widespread than we think.",
      "What we often measure is not intelligence itself, but its expression in environments we've designed.",
      "Some children express it through language.",
      "Some through numbers.",
      "Some, not at all, in the systems we put them in.",
      "That doesn't mean it isn't there.",
      "I don't think intelligence is the loudest child in the room. Or the one with the highest score.",
      "I think it's quieter.",
      "It's the child who looks at something unfamiliar and, instead of freezing or memorising, starts searching for the pattern.",
      "That's the mind I find myself wanting to notice more carefully now.",
    ],
  },
  {
    slug: "david-game-alpha-school-report",
    title: "Research & Comparison Between Projects Related to Project MENSA",
    summary:
      "A comparative report on David Game College, Alpha School, and ideas Mission MENSA can adopt from AI-led learning models.",
    author: "Mr. Vishwah Sivagurunathan",
    authorEmail: "team@missionmensa.org",
    views: 128,
    likes: 24,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/63/Students_at_a_school_in_Bangalore%2C_India_learning_to_code_on_Progate.jpg",
    content: [
      { type: "heading", level: 1, text: "Overview" },
      "There are many programs or schools around the world similar to our project, MENSA, but there are two schools that are strikingly comparable to our project. I have summarized what those two schools are doing and what ideas we can incorporate from them into our program.",
      { type: "heading", level: 1, text: "David Game College - Sabrewing Programme, London" },
      "David Game College, an independent sixth form in London's City district, launched the Sabrewing Programme in September 2024, the UK's first programme to entirely replace traditional classroom teaching with AI-driven adaptive learning for core curriculum subjects. The programme serves GCSE and A Level students across English, Maths, Sciences, Geography, Computer Science, Psychology, and Economics.",
      { type: "heading", level: 2, text: "How It Works" },
      { type: "heading", level: 3, text: "Morning AI Study" },
      "Students learn through adaptive platforms powered by Violet, their AI personal tutor. The system checks understanding, targets knowledge gaps, and enforces mastery gating. Students advance only when each topic is fully mastered. Learning Coaches monitor real-time data dashboards and intervene on a just-in-time basis.",
      { type: "heading", level: 3, text: "Afternoon Life Skills" },
      "300+ hours annually of practicals and workshops: resilience, public speaking, debate, teamwork, entrepreneurship, financial literacy, technology, and physical education.",
      { type: "heading", level: 2, text: "Learning Coaches, Not Teachers" },
      "Coaches are qualified teachers but do not necessarily know the subject content. They guide students through the AI systems, monitor studying behaviours using learning analytics, and mentor soft skills. Subject specialists are available for revision classes and exam preparation as exams approach. The pilot launched with 7 students; by July 2025 the programme expanded to all GCSE and A Level students.",
      { type: "heading", level: 2, text: "Results & Criticisms" },
      "72% of 2025 students secured at least one Russell Group university offer. The ISA Chief Executive called it a potential game-changer in education. Critics note that the high cost limits accessibility, the small cohort makes results hard to generalise, there are concerns about whether there is sufficient social learning for students, and the high coach-to-student ratio is not easily replicable at scale.",
      { type: "heading", level: 1, text: "Alpha School - 2 Hour Learning Model, USA" },
      "Austin Alpha School is a private K-12 network founded in Austin, Texas. Students complete all core academics in approximately two hours each morning using adaptive AI software, then spend afternoons on life-skills workshops and entrepreneurial projects. There are no traditional teachers; adults are called Guides. Tech billionaire Joe Liemandt has committed $1 billion to scale the model.",
      { type: "heading", level: 2, text: "How It Works" },
      { type: "heading", level: 3, text: "Morning 2 Hour Academics" },
      "Four 30-minute AI-powered sessions in maths, science, social studies, and language, plus 20 minutes of test-taking skills. The AI uses adaptive apps, not chat-based systems, with a vision model that watches the screen and coaches students. Mastery-based progression ensures no knowledge gaps.",
      { type: "heading", level: 3, text: "Afternoon Life Skills & Projects" },
      "Hands-on workshops cover public speaking, coding, financial literacy, entrepreneurship, and outdoor education. Students earn Alpha Bucks, a school currency, for completing work, teaching financial decision-making from kindergarten. Notable projects include student-run food trucks, TEDx Youth Talks, mobile app development, and Airbnb management.",
      { type: "heading", level: 2, text: "Guides, Not Teachers" },
      "Guides are not credentialed educators or subject experts. They are recruited from elite universities and professional backgrounds such as tech, entrepreneurship, and arts for their ability to motivate, mentor, and design engaging workshops. They earn six-figure salaries. If a student struggles academically, Alpha provides virtual access to subject-matter experts.",
      { type: "heading", level: 2, text: "Results & Criticisms" },
      "Alpha claims students score in the top 1-2% nationally on MAP standardised tests and reports a 2.6x faster growth rate than peers, with 94% of students saying they love school. The US Secretary of Education visited the Austin campus in September 2025. However, results are self-reported and have not been independently verified by external researchers. A 2026 Stanford review of 800+ papers found that AI benefits are less clear when students work without AI. Charter applications were denied in Pennsylvania, Arkansas, North Carolina, Utah, and South Carolina. The high cost, between $40K and $75K, makes the model inaccessible to most families.",
      { type: "heading", level: 1, text: "Ideas for Mission Mensa / Indus AI" },
      { type: "heading", level: 2, text: "1. Morning AI / Afternoon Human Split" },
      "Both programmes validate this structure. Our mornings can use the Indus AI Socratic agent for JEE Main. Afternoons can focus on Design Thinking, Life Entrepreneurship, Reflection & Growth, and mentor sessions.",
      { type: "heading", level: 2, text: "2. Mastery-Gating" },
      "Both enforce the principle of not advancing until mastery is achieved. Our skill-tree with prerequisite locking already does this, making it globally validated.",
      { type: "heading", level: 2, text: "3. Redefine the Adult Role" },
      "Replace teachers with Mentors or Coaches focused on character, discipline, and purpose, not subject instruction. This matches our Collective Intelligence model exactly.",
      { type: "heading", level: 2, text: "4. Real World Entrepreneurial Projects" },
      "Adopt Alpha's approach: real ventures with real stakes, not simulations. Each Mensa student launches a startup aligned to their talent domain.",
      { type: "heading", level: 2, text: "5. Just-in-Time Intervention" },
      "David Game's coaches use live data dashboards. Our Mem0 memory layer makes this even more powerful with persistent behavioural pattern detection across sessions.",
      {
        type: "table",
        title: "Where Indus AI Stands Apart",
        headers: ["", "David Game", "Alpha School", "Indus AI"],
        rows: [
          [
            "AI Method",
            "External platforms",
            "Adaptive apps (no chat)",
            "Socratic agent (Mem0)",
          ],
          [
            "Teaching",
            "Content delivery",
            "App-based mastery",
            "Never gives answers",
          ],
          [
            "Students",
            "GCSE / A Level resits",
            "General K-12",
            "Exceptional (IQ 130+)",
          ],
          ["Cost", "GBP 27K/year", "$40K-$75K/year", "Accessible"],
          ["Market", "UK only", "US only", "India"],
          ["Innovation", "None", "Student projects", "Startup per student"],
          [
            "Systems",
            "2 (acad + life)",
            "2 (acad + life)",
            "6 learning systems",
          ],
        ],
      },
      "**The Opportunity**",
      "David Game and Alpha have validated the hypothesis that AI can handle academic instruction while humans focus on character and life skills. But both serve affluent Western families with tuition above $30,000.",
      "No programme currently combines a conversational Socratic AI agent, persistent per-student memory, competitive exam preparation for JEE Main, a focus on underprivileged exceptional talent, and startup creation as a graduation requirement.",
      "Mission Mensa applies a globally validated model to a fundamentally more impactful context: discovering and cultivating India's exceptional outliers.",
    ],
  },
  {
    slug: "agentic-ai-transform-education-reduce-income-inequality",
    title:
      "Can Agentic AI Transform Education and Reduce Income Inequality? A New Path Forward for Underprivileged Children",
    summary:
      "How personalized AI-powered learning could democratize education, break the cycle of poverty, and create the next generation of innovators.",
    author: "Mrs Kamna Sinha Maam",
    authorEmail: "team@missionmensa.org",
    views: 136,
    likes: 31,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Indian_student_reading.jpg",
    content: [
      "**How personalized AI-powered learning could democratize education, break the cycle of poverty, and create the next generation of innovators**",
      "**The Crisis We Face**",
      "The world stands at a crossroads. Artificial intelligence is reshaping our economy at unprecedented speed, and early warning signs suggest it will deepen existing inequalities rather than solve them. The International Monetary Fund warns that AI will affect nearly 40% of jobs globally - rising to 60% in advanced economies - with a troubling conclusion: \"In most scenarios, AI will likely worsen overall inequality.\"",
      "But what if we're looking at this wrong? What if the very technology threatening to divide us could instead become the great equalizer?",
      "The answer lies not in AI replacing workers, but in AI literacy becoming as universal as reading and writing. And for the world's most disadvantaged children - the 750 million people who lack access to basic education - agentic AI systems might offer something unprecedented: personalized, world-class education available anywhere, anytime, without traditional schools or teachers.",
      "**The Intersection: Where \"Haves\" Meet \"Knows\"**",
      "To understand the opportunity, we must first understand the problem. Traditional economic inequality divides us into \"haves\" and \"have-nots\" based on financial capital. But AI introduces a new dimension: the \"knows\" versus \"knows-not\" divide based on AI literacy.",
      "These two divides create four distinct groups: 1. Haves + Knows: Wealthy individuals with AI skills experience exponential compounding of opportunities. 2. Haves + Knows-Not: The privileged but vulnerable - wealth provides a cushion but they risk being outcompeted. 3. Have-Nots + Knows: The most hopeful quadrant - where AI literacy becomes the bridge to economic opportunity. 4. Have-Nots + Knows-Not: The most dangerous spiral - lack of both resources and skills creates compounding disadvantage.",
      "The Brookings Institution confirms this pattern: \"Given this likely concentration of productivity gains among higher-income workers, policymakers should prioritize investments in AI literacy and access for a broader population of workers.\"",
      "The IMF adds that \"workers who are able to access the benefits of AI could increase their productivity and salary, while those who cannot are at risk of falling further behind.\"",
      "Here's the critical insight: unlike wealth, which takes generations to redistribute, AI literacy can be distributed at near-zero marginal cost. By moving children from \"Knows-Not\" to \"Knows,\" we can transform them from the most disadvantaged quadrant to the most hopeful one - regardless of their starting financial position.",
      "**The Traditional Education Barrier**",
      "For underprivileged children, traditional education has always been the promised path to upward mobility. But that path is broken.",
      "The reality is stark: 750 million people worldwide lack access to education and basic literacy. Nearly two-thirds of 10-year-olds cannot read and understand a simple text. In many developing countries, children don't acquire functional literacy or numeracy even after four years of school. There is a massive gender digital divide: for every 100 male youth with digital skills, there are only 65 female youth.",
      "The problem isn't just access to schools - it's access to quality education. As the World Bank notes, \"Many school systems in underdeveloped countries are, by their own admission, unable to provide their children with even the most basic skills in reading, writing, and math.\"",
      "Traditional schooling requires physical infrastructure, trained teachers, consistent attendance, standardized curriculum, and geographic proximity to schools.",
      "For hundreds of millions of children, these requirements are insurmountable barriers.",
      "**Enter Agentic AI: The Personalized Tutor Revolution**",
      "Now, imagine a different scenario.",
      "A 10-year-old girl in rural India who has never attended school can access an AI tutor on a basic smartphone. This isn't a chatbot that answers questions - it's an agentic AI system that assesses her current knowledge level across all subjects, creates a personalized learning path adapted to her pace and learning style, teaches in her native language with culturally relevant examples, adjusts in real time based on her comprehension and engagement, provides unlimited patience, tracks her progress, offers multimedia learning, functions offline when internet connectivity is unavailable, and costs nearly nothing to scale to millions of students.",
      "This isn't science fiction. MIT researcher Cynthia Breazeal notes that \"70 per cent of teens have used at least one type of generative AI,\" and emphasizes the importance of students being \"prepared to become engaged, productive citizens, who can use AI and understand its societal implications.\"",
      "The technology exists. The question is: will we deploy it to serve those who need it most?",
      "**The Agentic AI Advantage for Underprivileged Children**",
      "What makes agentic AI particularly powerful for underprivileged children isn't just personalization - it's the removal of traditional barriers.",
      "Geographic Independence: A child in a remote village has the same access to world-class AI tutoring as a child in an elite urban school. Distance becomes irrelevant.",
      "Economic Accessibility: While premium AI tools exist, the marginal cost of providing AI tutoring to one more student approaches zero. Google.org has already contributed over $40 million to AI literacy initiatives, reaching more than 13 million students. This is a fraction of what traditional school infrastructure would cost.",
      "Time Flexibility: Children who work during the day or care for siblings can learn at night or in short bursts throughout the day. The AI tutor is always available.",
      "Infinite Patience: Unlike human teachers managing large classes, AI tutors never get frustrated, never give up on a struggling student, and can repeat explanations thousands of times in different ways until understanding clicks.",
      "No Prerequisite Bias: Traditional schools often assume baseline knowledge. Agentic AI starts exactly where each child is - whether they're behind, on level, or advanced - and builds from there.",
      "Multilingual Support: AI can teach in hundreds of languages and dialects, removing language barriers that plague traditional education in multilingual regions.",
      "Learning Disability Accommodation: AI can automatically adapt to different learning styles, speeds, and needs without requiring specialized teachers or resources.",
      "Confidence Building: Many underprivileged children experience shame in traditional classrooms when they're behind their peers. AI tutors provide judgment-free learning environments where mistakes are private learning opportunities.",
      "**From Education to Entrepreneurship: Breaking the Cycle**",
      "Here's where the transformation becomes revolutionary: AI-literate children from disadvantaged backgrounds don't just gain employability - they gain the tools to become creators and entrepreneurs.",
      "**The Democratization of Capability**",
      "In the past, creating a business required capital for hiring teams, access to specialized expertise, networks of professional contacts, and physical infrastructure.",
      "AI fundamentally changes this equation. As noted in our analysis of the \"knows\" advantage, a single AI-literate individual can now build websites and applications, create marketing content, analyze market data, design products, manage operations, provide customer service, and handle accounting and finance.",
      "Tasks that once required a team of specialists can now be accomplished by one person with AI tools.",
      "**The Compounding Advantage**",
      "The World Economic Forum notes that \"AI & Machine Learning specialists top the list of fastest-growing jobs\" and that \"the most likely future is one where AI literacy and machine learning skills are at a premium, making AI education a new and valuable currency.\"",
      "But beyond employment, AI literacy enables lower barriers to innovation, global market access, continuous learning, network effects, and wealth creation. Ideas can be tested quickly, AI translation can support worldwide markets, AI tutors can provide lifelong learning support, AI-literate communities can collaborate globally, and entrepreneurs can build valuable businesses that create jobs in their communities.",
      "**The Call to Action**",
      "We stand at a unique moment in history. The technology exists to break the cycle of poverty through education. The question is whether we have the vision and will to deploy it for those who need it most.",
      "To policymakers: Make universal AI literacy a priority equivalent to universal basic education. Invest in infrastructure, access, and support.",
      "To technology companies: Follow Google's lead. Provide free or heavily subsidized AI educational tools to underprivileged populations. Make this a core part of social responsibility, not a marketing afterthought.",
      "To NGOs and international organizations: Expand the AI Skills Coalition model. Build community support systems. Measure outcomes. Share what works.",
      "To researchers and educators: Continue developing AI literacy frameworks like the OECD/EC model. Make them practical, culturally adaptable, and proven through rigorous evaluation.",
      "To all of us: Recognize that the \"Knows vs. Knows-Not\" divide will define economic opportunity in the 21st century as profoundly as literacy defined it in the 20th. We must ensure AI literacy becomes universal, not privileged.",
    ],
  },
];
const SEEDED_BLOG_SLUGS = new Set(blogs.map((blog) => blog.slug));

export function getBlogStats(blog: BlogEntry) {
  return {
    views: blog.viewCount ?? 0,
    likes: blog.likedBy?.length ?? 0,
    comments: blog.comments?.length ?? 0,
  };
}

export function mergePublishedAndSeedBlogs(publishedBlogs: BlogEntry[]) {
  const mergedBlogs = new Map<string, BlogEntry>();

  blogs.map(normalizeBlogEntry).forEach((blog) => {
    mergedBlogs.set(blog.slug, blog);
  });

  publishedBlogs.map(normalizeBlogEntry).forEach((blog) => {
    mergedBlogs.set(blog.slug, blog);
  });

  const orderedBlogs = [
    ...publishedBlogs.map((blog) => normalizeBlogEntry(blog).slug),
    ...blogs.map((blog) => blog.slug),
  ];

  return Array.from(new Set(orderedBlogs))
    .map((slug) => mergedBlogs.get(slug))
    .filter((blog): blog is BlogEntry => Boolean(blog));
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
    return readContentCollection<BlogEntry>("publishedBlogs", []).map(
      normalizeBlogEntry,
    );
  }

  const legacyBlogs = readLegacyPublishedBlogs();
  if (legacyBlogs.length) {
    saveContentCollection("publishedBlogs", legacyBlogs);
  }

  return legacyBlogs.map(normalizeBlogEntry);
}

export async function getPublishedBlogsAsync(): Promise<BlogEntry[]> {
  const localBlogs = getPublishedBlogs();
  const remoteBlogs = await readRemoteContentCollection<BlogEntry>(
    "publishedBlogs",
    localBlogs,
  );

  if (remoteBlogs.length) {
    return remoteBlogs.map(normalizeBlogEntry);
  }

  return localBlogs;
}

function getMergedBlogBySlug(slug: string) {
  return mergePublishedAndSeedBlogs(getPublishedBlogs()).find(
    (blog) => blog.slug === slug,
  );
}

export function incrementBlogView(slug: string) {
  const existingBlog = getMergedBlogBySlug(slug);
  if (!existingBlog) return null;

  const updatedBlog = normalizeBlogEntry({
    ...existingBlog,
    viewCount: (existingBlog.viewCount ?? 0) + 1,
  });

  savePublishedBlog(updatedBlog);
  return updatedBlog;
}

export async function incrementBlogViewAsync(slug: string) {
  const existingBlog = getMergedBlogBySlug(slug);
  if (!existingBlog) return getPublishedBlogs();

  const updatedBlog = normalizeBlogEntry({
    ...existingBlog,
    viewCount: (existingBlog.viewCount ?? 0) + 1,
  });

  await savePublishedBlogAsync(updatedBlog);
  return getPublishedBlogs();
}

export function toggleBlogLike(slug: string, userEmail: string) {
  const normalizedEmail = userEmail.trim().toLowerCase();
  if (!normalizedEmail) return null;

  const existingBlog = getMergedBlogBySlug(slug);
  if (!existingBlog) return null;

  const likedBy = new Set(existingBlog.likedBy ?? []);
  if (likedBy.has(normalizedEmail)) {
    likedBy.delete(normalizedEmail);
  } else {
    likedBy.add(normalizedEmail);
  }

  const updatedBlog = normalizeBlogEntry({
    ...existingBlog,
    likedBy: Array.from(likedBy),
  });

  savePublishedBlog(updatedBlog);
  return updatedBlog;
}

function createBlogCommentId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `blog-comment-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function addBlogComment(
  slug: string,
  payload: {
    authorName: string;
    authorEmail: string;
    body: string;
  },
) {
  const existingBlog = getMergedBlogBySlug(slug);
  if (!existingBlog) return null;

  const normalizedAuthorEmail = payload.authorEmail.trim().toLowerCase();
  const normalizedAuthorName = payload.authorName.trim();
  const normalizedBody = payload.body.trim();
  if (!normalizedAuthorEmail || !normalizedBody) return null;

  const updatedBlog = normalizeBlogEntry({
    ...existingBlog,
    comments: [
      ...(existingBlog.comments ?? []),
      {
        id: createBlogCommentId(),
        authorName: normalizedAuthorName || "User",
        authorEmail: normalizedAuthorEmail,
        body: normalizedBody,
        createdAt: new Date().toISOString(),
      },
    ],
  });

  savePublishedBlog(updatedBlog);
  return updatedBlog;
}

export function deleteBlogComment(
  slug: string,
  commentId: string,
  userEmail: string,
) {
  const existingBlog = getMergedBlogBySlug(slug);
  if (!existingBlog) return null;

  const normalizedUserEmail = userEmail.trim().toLowerCase();
  if (!normalizedUserEmail) return null;

  const targetComment = (existingBlog.comments ?? []).find(
    (comment) => comment.id === commentId,
  );
  if (!targetComment) return null;

  if (targetComment.authorEmail.trim().toLowerCase() !== normalizedUserEmail) {
    return null;
  }

  const updatedBlog = normalizeBlogEntry({
    ...existingBlog,
    comments: (existingBlog.comments ?? []).filter(
      (comment) => comment.id !== commentId,
    ),
  });

  savePublishedBlog(updatedBlog);
  return updatedBlog;
}

export async function toggleBlogLikeAsync(slug: string, userEmail: string) {
  const normalizedEmail = userEmail.trim().toLowerCase();
  if (!normalizedEmail) return getPublishedBlogs();

  const existingBlog = getMergedBlogBySlug(slug);
  if (!existingBlog) return getPublishedBlogs();

  const likedBy = new Set(existingBlog.likedBy ?? []);
  if (likedBy.has(normalizedEmail)) {
    likedBy.delete(normalizedEmail);
  } else {
    likedBy.add(normalizedEmail);
  }

  const updatedBlog = normalizeBlogEntry({
    ...existingBlog,
    likedBy: Array.from(likedBy),
  });

  await savePublishedBlogAsync(updatedBlog);
  return getPublishedBlogs();
}

export function savePublishedBlog(blog: BlogEntry) {
  const normalizedBlog = normalizeBlogEntry(blog);
  const current = getPublishedBlogs();
  const filtered = current.filter((entry) => entry.slug !== normalizedBlog.slug);
  saveContentCollection("publishedBlogs", [normalizedBlog, ...filtered]);
}

export async function savePublishedBlogAsync(blog: BlogEntry) {
  const normalizedBlog = normalizeBlogEntry(blog);
  const current = await getPublishedBlogsAsync();
  const filtered = current.filter((entry) => entry.slug !== normalizedBlog.slug);
  await saveRemoteContentCollection("publishedBlogs", [normalizedBlog, ...filtered]);
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
