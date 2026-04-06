import { FileText, PenSquare, PlusCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import {
  blogs,
  deletePublishedBlog,
  deletePublishedBlogAsync,
  getPublishedBlogs,
  getPublishedBlogsAsync,
  type BlogEntry,
} from "./blogData";

const getDraftStorageKey = (email?: string | null) =>
  `mission-mensa-blog-draft:${email ?? "guest"}`;

export default function WritingBlogsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(
    null,
  );
  const [visibleBlogs, setVisibleBlogs] = useState<BlogEntry[]>([
    ...getPublishedBlogs(),
    ...blogs,
  ]);

  useEffect(() => {
    const message = (
      location.state as { saveSuccessMessage?: string } | null
    )?.saveSuccessMessage;

    if (!message) return;

    setSaveSuccessMessage(message);
    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    void getPublishedBlogsAsync().then((publishedBlogs) => {
      setVisibleBlogs([...publishedBlogs, ...blogs]);
    });
  }, [saveSuccessMessage]);

  const recentDrafts = useMemo(() => {
    const publishedBlogs = getPublishedBlogs();
    const publishedItems = publishedBlogs.map((blog) => ({
      title: blog.title,
      status: "Published" as const,
      updatedAt: "Published recently",
    }));

    let savedDraftItems: Array<{
      title: string;
      status: "Draft";
      updatedAt: string;
    }> = [];

    try {
      const rawDraft = localStorage.getItem(getDraftStorageKey(user?.email));
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft) as {
          title?: string;
          savedAt?: string;
        };
        const isAlreadyPublished = publishedBlogs.some(
          (blog) => blog.title === (parsed.title || "Untitled Blog Draft"),
        );
        if (isAlreadyPublished) {
          return publishedItems.slice(0, 10);
        }
        savedDraftItems = [
          {
            title: parsed.title || "Untitled Blog Draft",
            status: "Draft",
            updatedAt: parsed.savedAt
              ? `Saved ${new Date(parsed.savedAt).toLocaleDateString()}`
              : "Saved recently",
          },
        ];
      }
    } catch {
      savedDraftItems = [];
    }

    return [...savedDraftItems, ...publishedItems].slice(0, 10);
  }, [saveSuccessMessage, user?.email]);

  function handleDeleteBlog(slug: string) {
    deletePublishedBlog(slug);
    setVisibleBlogs([...getPublishedBlogs(), ...blogs]);
    void deletePublishedBlogAsync(slug).then((publishedBlogs) => {
      setVisibleBlogs([...publishedBlogs, ...blogs]);
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <style>{`
        @keyframes dashboardFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -16px, 0) scale(1.04);
          }
        }
      `}</style>
      {saveSuccessMessage && (
        <div className="mb-6 rounded-2xl border border-[#A5C85A]/30 bg-[#F4FBE8] px-5 py-4 text-sm font-semibold text-[#557127]">
          {saveSuccessMessage}
        </div>
      )}
      <div className="relative mb-8 flex flex-col gap-4 overflow-hidden rounded-[2rem] border border-[#1A5A63]/20 bg-[linear-gradient(135deg,#0E2D35_0%,#1A6972_42%,#63D1E7_100%)] p-8 text-white shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_34%,rgba(255,201,75,0.12)_68%,rgba(165,200,90,0.16)_100%)]" />
        <div className="pointer-events-none absolute -left-16 -top-14 h-64 w-64 animate-[dashboardFloat_15s_ease-in-out_infinite] rounded-full bg-[#5EC1E8]/25 blur-3xl" />
        <div className="pointer-events-none absolute right-[-4rem] top-10 h-72 w-72 animate-[dashboardFloat_17s_ease-in-out_infinite_reverse] rounded-full bg-[#FFC94B]/18 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-7rem] left-[28%] h-72 w-72 animate-[dashboardFloat_18s_ease-in-out_infinite] rounded-full bg-[#A5C85A]/18 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 left-[56%] w-px bg-white/10" />
        <div className="pointer-events-none absolute right-[14%] top-[18%] h-24 w-24 rotate-12 rounded-[2rem] border border-white/12 bg-white/8 backdrop-blur-sm" />
        <div className="pointer-events-none absolute left-[12%] bottom-[16%] h-20 w-20 -rotate-12 rounded-[1.75rem] border border-white/12 bg-white/8 backdrop-blur-sm" />
        <div className="max-w-3xl relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
            <PenSquare size={16} />
            Writing Blogs
          </div>
          <h1 className="text-3xl font-bold">Manage your publishing workspace.</h1>
          <p className="mt-2 text-sm text-white/85 sm:text-base">
            Create, review, and continue blog drafts in a dedicated writing
            environment built for long-form content.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/writing-blogs/new")}
          className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#123c44] transition-colors hover:bg-[#FAF7F2]"
        >
          <PlusCircle size={16} />
          Create New Draft
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.72fr),minmax(0,1.28fr)]">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#2F3E3E]">
                Recent Drafts
              </h2>
              <p className="text-sm text-gray-500">
                Continue working on existing blog posts.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {recentDrafts.map((draft) => (
              <button
                key={draft.title}
                onClick={() => navigate("/dashboard/writing-blogs/new")}
                className="flex w-full items-start gap-4 rounded-2xl border border-gray-100 bg-[#FCFEFE] p-5 text-left transition hover:border-[#2CA4A4]/35 hover:bg-white"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2CA4A4]/10 text-[#2CA4A4]">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-[#2F3E3E]">
                      {draft.title}
                    </h3>
                    <span className="rounded-full bg-[#A5C85A]/15 px-2.5 py-1 text-xs font-medium text-[#557127]">
                      {draft.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{draft.updatedAt}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#2F3E3E]">Blogs</h2>
          <div className="mt-5 space-y-5">
            {visibleBlogs.map((blog) => (
              (() => {
                const canEdit =
                  user?.email?.trim().toLowerCase() ===
                  blog.authorEmail.trim().toLowerCase();
                return (
              <article
                key={blog.slug}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-[#FCFEFE]"
              >
                <div className="flex flex-col xl:flex-row">
                  <div className="aspect-[16/10] w-full overflow-hidden xl:w-72 xl:flex-shrink-0">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                  <h3 className="text-2xl font-semibold text-[#2F3E3E]">
                    {blog.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-gray-500">
                    {blog.summary}
                  </p>
                  <p className="mt-4 text-sm font-medium text-[#2CA4A4]">
                    Written by {blog.author}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/writing-blogs/read/${blog.slug}`)
                      }
                      className="rounded-full bg-[#2F3E3E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#203030]"
                    >
                      Read More
                    </button>
                    {canEdit ? (
                      <>
                        <button
                          onClick={() => navigate("/dashboard/writing-blogs/new")}
                          className="rounded-full border border-[#2CA4A4]/30 px-4 py-2 text-sm font-semibold text-[#2CA4A4] transition hover:bg-[#2CA4A4]/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.slug)}
                          className="rounded-full bg-[#9A3D3D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7F3030]"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-400">
                        Read Only
                      </span>
                    )}
                  </div>
                  </div>
                </div>
              </article>
                );
              })()
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
