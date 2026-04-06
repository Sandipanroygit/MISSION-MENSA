import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
} from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Rocket,
  Redo2,
  Save,
  Type,
  Underline,
  Undo2,
  Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { savePublishedBlog, savePublishedBlogAsync } from "./blogData";

const fontFamilies = [
  { label: "Modern Sans", value: "Arial, sans-serif" },
  { label: "Classic Serif", value: "Georgia, serif" },
  { label: "Readable", value: "'Trebuchet MS', sans-serif" },
  { label: "Editorial", value: "'Times New Roman', serif" },
];

const fontSizes = [
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "24", value: "24px" },
  { label: "32", value: "32px" },
];

const initialBody = `
  <h2>Begin writing here</h2>
  <p>Create a compelling introduction, expand with examples, and use media to make the blog richer.</p>
`;

const getDraftStorageKey = (email?: string | null) =>
  `mission-mensa-blog-draft:${email ?? "guest"}`;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function normaliseYouTubeUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;

      const parts = parsed.pathname.split("/").filter(Boolean);
      const embedIndex = parts.findIndex((part) => part === "embed");
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[embedIndex + 1]}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export default function BlogDraftEditorPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const [title, setTitle] = useState("Untitled Blog Draft");
  const [summary, setSummary] = useState(
    "A draft space for ideas, structure, media, and polished publishing.",
  );
  const [fontFamily, setFontFamily] = useState(fontFamilies[0].value);
  const [fontSize, setFontSize] = useState(fontSizes[2].value);
  const [editorHtml, setEditorHtml] = useState(initialBody);
  const [saveMessage, setSaveMessage] = useState("Not saved yet");
  const hasVisibleContent = editorHtml.replace(/<[^>]*>/g, "").trim().length > 0;

  useEffect(() => {
    const savedDraft = localStorage.getItem(getDraftStorageKey(user?.email));

    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft) as {
          title: string;
          summary: string;
          fontFamily: string;
          fontSize: string;
          content: string;
          savedAt: string;
        };

        setTitle(parsed.title);
        setSummary(parsed.summary);
        setFontFamily(parsed.fontFamily);
        setFontSize(parsed.fontSize);
        setEditorHtml(parsed.content);
        setSaveMessage(`Saved ${new Date(parsed.savedAt).toLocaleString()}`);

        if (editorRef.current) {
          editorRef.current.innerHTML = parsed.content;
        }
        return;
      } catch {
        localStorage.removeItem(getDraftStorageKey(user?.email));
      }
    }

    if (editorRef.current && !editorRef.current.innerHTML.trim()) {
      editorRef.current.innerHTML = initialBody;
      setEditorHtml(initialBody);
    }
  }, [user?.email]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    savedRangeRef.current = selection.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !savedRangeRef.current) return;
    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
  };

  const syncEditorHtml = () => {
    setEditorHtml(editorRef.current?.innerHTML ?? "");
  };

  const runCommand = (command: string, value?: string) => {
    focusEditor();
    restoreSelection();
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(command, false, value);
    saveSelection();
    syncEditorHtml();
  };

  const applyFontSize = (size: string) => {
    setFontSize(size);
    focusEditor();
    restoreSelection();
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand("fontSize", false, "7");

    editorRef.current
      ?.querySelectorAll('font[size="7"]')
      .forEach((node) => {
        node.removeAttribute("size");
        (node as HTMLElement).style.fontSize = size;
      });

    saveSelection();
    syncEditorHtml();
  };

  const applyFontFamily = (family: string) => {
    setFontFamily(family);
    runCommand("fontName", family);
  };

  const insertHtmlAtCursor = (html: string) => {
    focusEditor();
    restoreSelection();
    document.execCommand("insertHTML", false, html);
    saveSelection();
    syncEditorHtml();
  };

  const handleAssetUpload = (
    event: ChangeEvent<HTMLInputElement>,
    kind: "image" | "video",
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);

      if (kind === "image") {
        insertHtmlAtCursor(`
          <figure style="margin: 24px 0;">
            <img src="${url}" alt="${file.name}" style="max-width: 100%; border-radius: 18px;" />
            <figcaption style="margin-top: 8px; color: #6b7280; font-size: 14px;">${file.name}</figcaption>
          </figure>
        `);
      } else {
        insertHtmlAtCursor(`
          <figure style="margin: 24px 0;">
            <video controls style="max-width: 100%; border-radius: 18px;">
              <source src="${url}" type="${file.type}" />
            </video>
            <figcaption style="margin-top: 8px; color: #6b7280; font-size: 14px;">${file.name}</figcaption>
          </figure>
        `);
      }
    });

    event.target.value = "";
  };

  const insertYoutubeEmbed = (embedUrl: string) => {
    insertHtmlAtCursor(`
      <div style="margin: 24px 0;">
        <div style="position: relative; width: 100%; padding-top: 56.25%; overflow: hidden; border-radius: 18px;">
          <iframe
            src="${embedUrl}"
            title="Embedded YouTube video"
            style="position: absolute; inset: 0; width: 100%; height: 100%; border: 0;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    `);
  };

  const handleEditorPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const pastedText = event.clipboardData.getData("text").trim();
    const embedUrl = normaliseYouTubeUrl(pastedText);

    if (!embedUrl) return;

    event.preventDefault();
    insertYoutubeEmbed(embedUrl);
  };

  const handleResetDraft = () => {
    setTitle("Untitled Blog Draft");
    setSummary(
      "A draft space for ideas, structure, media, and polished publishing.",
    );
    setFontFamily(fontFamilies[0].value);
    setFontSize(fontSizes[2].value);
    if (editorRef.current) {
      editorRef.current.innerHTML = initialBody;
    }
    setEditorHtml(initialBody);
    localStorage.removeItem(getDraftStorageKey(user?.email));
    setSaveMessage("Draft reset");
  };

  const handleSaveDraft = () => {
    const content = editorRef.current?.innerHTML ?? editorHtml;
    const savedAt = new Date().toISOString();

    localStorage.setItem(
      getDraftStorageKey(user?.email),
      JSON.stringify({
        title,
        summary,
        fontFamily,
        fontSize,
        content,
        savedAt,
      }),
    );

    setEditorHtml(content);
    setSaveMessage(`Saved ${new Date(savedAt).toLocaleString()}`);
    navigate("/dashboard/writing-blogs", {
      state: { saveSuccessMessage: "Draft saved successfully." },
    });
  };

  const handlePublishDraft = () => {
    const content = editorRef.current?.innerHTML ?? editorHtml;
    const savedAt = new Date().toISOString();
    const plainContent = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

    localStorage.setItem(
      getDraftStorageKey(user?.email),
      JSON.stringify({
        title,
        summary,
        fontFamily,
        fontSize,
        content,
        savedAt,
      }),
    );

    const publishedBlog = {
      slug: slugify(title) || `published-${Date.now()}`,
      title,
      summary,
      author: user?.name ?? "Unknown Author",
      authorEmail: user?.email ?? "guest@example.com",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
      content: plainContent
        ? plainContent
            .split(/(?<=[.!?])\s+/)
            .filter(Boolean)
            .slice(0, 6)
        : ["This published blog is ready to be expanded with your final content."],
    };

    savePublishedBlog(publishedBlog);
    void savePublishedBlogAsync(publishedBlog);

    localStorage.removeItem(getDraftStorageKey(user?.email));

    setEditorHtml(content);
    setSaveMessage(`Published ${new Date(savedAt).toLocaleString()}`);
    navigate("/dashboard/writing-blogs", {
      state: { saveSuccessMessage: "Draft published successfully." },
    });
  };

  const wordCount = editorRef.current?.innerText.trim()
    ? editorRef.current.innerText
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;

  const textToolbarButtons = [
    { icon: Bold, action: () => runCommand("bold"), label: "Bold" },
    { icon: Italic, action: () => runCommand("italic"), label: "Italic" },
    {
      icon: Underline,
      action: () => runCommand("underline"),
      label: "Underline",
    },
    {
      icon: AlignLeft,
      action: () => runCommand("justifyLeft"),
      label: "Left",
    },
    {
      icon: AlignCenter,
      action: () => runCommand("justifyCenter"),
      label: "Center",
    },
    {
      icon: AlignRight,
      action: () => runCommand("justifyRight"),
      label: "Right",
    },
    {
      icon: List,
      action: () => runCommand("insertUnorderedList"),
      label: "Bullets",
    },
    {
      icon: ListOrdered,
      action: () => runCommand("insertOrderedList"),
      label: "Numbered",
    },
  ];

  const iconToolbarButtons = [
    { icon: Undo2, action: () => runCommand("undo"), label: "Undo" },
    { icon: Redo2, action: () => runCommand("redo"), label: "Redo" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-[linear-gradient(135deg,#123c44_0%,#2CA4A4_45%,#5EC1E8_100%)] p-8 text-white shadow-sm lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <button
            onClick={() => navigate("/dashboard/writing-blogs")}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium transition hover:bg-white/20"
          >
            <ArrowLeft size={16} />
            Back to Writing Blogs
          </button>
          <h1 className="text-3xl font-bold">Blog Draft Editor</h1>
          <p className="mt-2 text-sm text-white/85 sm:text-base">
            Write in a dedicated page with full formatting, media uploads, and
            automatic YouTube embedding on paste.
          </p>
          <p className="mt-3 text-sm text-white/80">{saveMessage}</p>
        </div>
        <div className="flex flex-col items-start gap-3 lg:items-end">
          <button
            onClick={handlePublishDraft}
            className="inline-flex items-center gap-2 rounded-full bg-[#123c44] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f3137]"
          >
            <Rocket size={16} />
            Publish
          </button>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#123c44] transition-colors hover:bg-[#FAF7F2]"
            >
              <Save size={16} />
              Save Draft
            </button>
            <button
              onClick={handleResetDraft}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Reset Draft
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px,minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#2F3E3E]">Draft Stats</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#F7FAFA] p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Words
                </p>
                <p className="mt-1 text-2xl font-bold text-[#2F3E3E]">
                  {wordCount}
                </p>
              </div>
              <div className="rounded-2xl bg-[#F7FAFA] p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Media
                </p>
                <p className="mt-1 text-2xl font-bold text-[#2F3E3E]">
                  {(
                    editorHtml.match(/<img|<video|<iframe/g)?.length ?? 0
                  ).toString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#2F3E3E]">Draft Details</h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#2F3E3E]">
                  Blog title
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#2F3E3E] outline-none transition focus:border-[#2CA4A4] focus:ring-4 focus:ring-[#2CA4A4]/10"
                  placeholder="Enter blog title"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#2F3E3E]">
                  Short summary
                </span>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#2F3E3E] outline-none transition focus:border-[#2CA4A4] focus:ring-4 focus:ring-[#2CA4A4]/10"
                  placeholder="Write a short summary"
                />
              </label>
            </div>
          </div>
        </aside>

        <section className="rounded-[2rem] border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <div className="flex flex-col gap-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-none p-0 text-3xl font-bold text-[#2F3E3E] outline-none placeholder:text-gray-300"
                placeholder="Untitled blog"
              />
              <p className="text-sm text-gray-500">{summary}</p>
              <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                <select
                  value={fontFamily}
                  onChange={(e) => applyFontFamily(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#2F3E3E] outline-none"
                >
                  {fontFamilies.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>

                <select
                  value={fontSize}
                  onChange={(e) => applyFontSize(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#2F3E3E] outline-none"
                >
                  {fontSizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}px
                    </option>
                  ))}
                </select>

                {textToolbarButtons.map(({ icon: Icon, action, label }) => (
                  <button
                    key={label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={action}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-[#2F3E3E] transition hover:border-[#2CA4A4]/40 hover:text-[#2CA4A4]"
                    aria-label={label}
                    title={label}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}

                {iconToolbarButtons.map(({ icon: Icon, action, label }) => (
                  <button
                    key={label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={action}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#2F3E3E] transition hover:border-[#2CA4A4]/40 hover:text-[#2CA4A4]"
                    aria-label={label}
                    title={label}
                  >
                    <Icon size={16} />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#2F3E3E] transition hover:border-[#2CA4A4]/40 hover:text-[#2CA4A4]"
                >
                  <ImagePlus size={16} />
                  Images
                </button>

                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#2F3E3E] transition hover:border-[#2CA4A4]/40 hover:text-[#2CA4A4]"
                >
                  <Video size={16} />
                  Videos
                </button>
              </div>
            </div>
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => handleAssetUpload(event, "image")}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(event) => handleAssetUpload(event, "video")}
          />

          <div className="p-6">
            <div className="rounded-[1.5rem] bg-[#FBF8F1] p-4 sm:p-6">
              <div className="relative mx-auto min-h-[720px] max-w-4xl rounded-[1.5rem] border border-[#E8E0D1] bg-white px-6 py-8 shadow-[0_20px_60px_rgba(47,62,62,0.08)] sm:px-10">
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
                  <Type size={16} />
                  Rich text blog canvas
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={syncEditorHtml}
                  onPaste={handleEditorPaste}
                  onBlur={saveSelection}
                  onKeyUp={saveSelection}
                  onMouseUp={saveSelection}
                  className="min-h-[580px] outline-none"
                  style={{
                    fontFamily,
                    fontSize,
                    lineHeight: 1.8,
                    color: "#2F3E3E",
                  }}
                />
                {!hasVisibleContent && (
                  <p className="pointer-events-none absolute left-10 top-24 text-base text-gray-300">
                    Start writing your blog here...
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
