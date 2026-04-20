import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  FileUp,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Rocket,
  Redo2,
  Save,
  Table2,
  Type,
  Underline,
  Undo2,
  Video,
} from "lucide-react";
import * as mammoth from "mammoth/mammoth.browser";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import {
  type BlogContentBlock,
  type BlogEntry,
  getDefaultBlogCover,
  getPublishedBlogs,
  mergePublishedAndSeedBlogs,
  savePublishedBlog,
  savePublishedBlogAsync,
} from "./blogData";

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

const defaultLineSpacing = 1.8;
const defaultParagraphSpacing = 14;

const defaultTitle = "Untitled Blog Draft";
const defaultSummary =
  "A draft space for ideas, structure, media, and polished publishing.";
const editorPlaceholderTitle = "Begin writing here";
const editorPlaceholderDescription =
  "Create a compelling introduction, expand with examples, and use media to make the blog richer.";

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

function getYouTubeVideoId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "") || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return id;

      const parts = parsed.pathname.split("/").filter(Boolean);
      const embedIndex = parts.findIndex((part) => part === "embed");
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return parts[embedIndex + 1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

function createYouTubePlaceholderHtml(embedUrl: string, title = "Embedded YouTube video") {
  const videoId = getYouTubeVideoId(embedUrl);
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";

  return `
    <figure data-media-block="true" data-youtube-embed="${escapeHtml(embedUrl)}" contenteditable="false" style="margin: 24px 0;">
      <div style="width: min(100%, 760px); max-width: 100%; min-width: 220px; resize: both; overflow: auto; border: 1px dashed #9ca3af; border-radius: 18px; padding: 4px;">
        <div style="position: relative; width: 100%; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 14px; border: 1px solid #d1d5db; background: #111827;">
          ${thumbnail ? `<img src="${thumbnail}" alt="YouTube preview" style="width: 100%; height: 100%; object-fit: cover;" />` : ""}
          <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
            <span style="display: inline-flex; align-items: center; gap: 8px; border-radius: 9999px; background: rgba(255,255,255,0.92); color: #111827; padding: 8px 14px; font-weight: 700; font-size: 13px;">
              ▶ Play Video
            </span>
          </div>
        </div>
      </div>
      <figcaption style="margin-top: 8px; color: #6b7280; font-size: 14px;">${escapeHtml(title)}</figcaption>
    </figure>
    <p><br /></p>
  `;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function normalizeDraftTitle(value?: string) {
  const nextValue = value?.trim() ?? "";
  return nextValue === defaultTitle ? "" : nextValue;
}

function normalizeDraftSummary(value?: string) {
  const nextValue = value?.trim() ?? "";
  return nextValue === defaultSummary ? "" : nextValue;
}

function normalizeDraftContent(value?: string) {
  const nextValue = value?.trim() ?? "";
  if (!nextValue) return "";

  const plainText = nextValue.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (
    plainText ===
    `${editorPlaceholderTitle} ${editorPlaceholderDescription}`
  ) {
    return "";
  }

  return value ?? "";
}

function readFileAsArrayBuffer(file: File) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function markdownToHtml(value: string) {
  const pattern = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  return value
    .split(pattern)
    .map((part) => {
      if (!part) return "";
      if (part.startsWith("***") && part.endsWith("***")) {
        return `<strong><em>${escapeHtml(part.slice(3, -3))}</em></strong>`;
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return `<strong>${escapeHtml(part.slice(2, -2))}</strong>`;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return `<em>${escapeHtml(part.slice(1, -1))}</em>`;
      }
      return escapeHtml(part);
    })
    .join("")
    .replace(/\n/g, "<br />");
}

function inlineNodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();
  const childText = Array.from(element.childNodes).map(inlineNodeToMarkdown).join("");

  if (tag === "strong" || tag === "b") return `**${childText}**`;
  if (tag === "em" || tag === "i") return `*${childText}*`;
  if (tag === "u") return `<u>${childText}</u>`;
  if (tag === "br") return "\n";
  if (tag === "a") {
    const href = element.getAttribute("href");
    if (href) return `${childText} (${href})`;
  }

  return childText;
}

function normalizeBlockText(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").trim();
}

function extractTableBlock(tableElement: HTMLTableElement): BlogContentBlock | null {
  const caption = tableElement.querySelector("caption")?.textContent?.trim() ?? "";
  const firstHeadRow = tableElement.querySelector("thead tr");
  const thCells = firstHeadRow
    ? Array.from(firstHeadRow.querySelectorAll("th"))
        .map((cell) => normalizeBlockText(inlineNodeToMarkdown(cell)))
        .filter(Boolean)
    : [];

  const allRows = Array.from(tableElement.querySelectorAll("tr"));
  const bodyRows = Array.from(tableElement.querySelectorAll("tbody tr"));
  const candidateRows = bodyRows.length ? bodyRows : allRows.slice(thCells.length ? 1 : 0);

  const rows = candidateRows
    .map((row) =>
      Array.from(row.querySelectorAll("th, td"))
        .map((cell) => normalizeBlockText(inlineNodeToMarkdown(cell)))
        .filter((cell) => cell.length > 0),
    )
    .filter((row) => row.length > 0);

  const headers = thCells.length ? thCells : rows.shift() ?? [];
  if (headers.length === 0 && rows.length === 0) return null;

  return {
    type: "table",
    title: caption || "Comparison Table",
    headers: headers.length ? headers : ["Column 1"],
    rows: rows.length ? rows : [[""]],
  };
}

function parseEditorHtmlToBlocks(html: string): BlogContentBlock[] {
  if (!html.trim()) return [];

  const parser = new DOMParser();
  const documentRoot = parser.parseFromString(html, "text/html");
  const blocks: BlogContentBlock[] = [];

  const pushTextBlock = (value: string) => {
    const normalized = normalizeBlockText(value);
    if (normalized) blocks.push(normalized);
  };

  const pushHtmlBlock = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    blocks.push({
      type: "html",
      html: normalized,
    });
  };

  const visitNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      pushTextBlock(node.textContent ?? "");
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as HTMLElement;
    const tag = element.tagName.toLowerCase();
    const youtubePlaceholderUrl =
      element.getAttribute("data-youtube-embed")?.trim() ?? "";

    if (youtubePlaceholderUrl) {
      blocks.push({
        type: "youtube",
        url: youtubePlaceholderUrl,
        title: "Embedded YouTube video",
      });
      return;
    }

    if (tag === "h1" || tag === "h2" || tag === "h3") {
      const text = normalizeBlockText(inlineNodeToMarkdown(element));
      if (text) {
        blocks.push({
          type: "heading",
          level: Number(tag.slice(1)) as 1 | 2 | 3,
          text,
        });
      }
      return;
    }

    if (tag === "table") {
      const tableBlock = extractTableBlock(element as HTMLTableElement);
      if (tableBlock) blocks.push(tableBlock);
      return;
    }

    if (tag === "figure") {
      const ytPlaceholder = element.querySelector(
        "[data-youtube-embed]",
      ) as HTMLElement | null;
      if (ytPlaceholder) {
        const url = ytPlaceholder.getAttribute("data-youtube-embed")?.trim() ?? "";
        if (url) {
          blocks.push({
            type: "youtube",
            url,
            title: "Embedded YouTube video",
          });
          return;
        }
      }

      const embedded = element.querySelector("iframe");
      if (embedded) {
        visitNode(embedded);
        return;
      }

      const embeddedTable = element.querySelector("table") as HTMLTableElement | null;
      if (embeddedTable) {
        const tableBlock = extractTableBlock(embeddedTable);
        if (tableBlock) blocks.push(tableBlock);
        return;
      }

      pushHtmlBlock(element.outerHTML);
      return;
    }

    if (tag === "iframe") {
      const src = element.getAttribute("src")?.trim() ?? "";
      if (!src) return;

      if (src.includes("youtube.com/embed/")) {
        blocks.push({
          type: "youtube",
          url: src,
          title: element.getAttribute("title")?.trim() || "Embedded YouTube video",
        });
        return;
      }

      pushHtmlBlock(element.outerHTML);
      return;
    }

    if (
      [
        "p",
        "blockquote",
        "pre",
        "figcaption",
        "ul",
        "ol",
        "div",
        "section",
        "article",
        "img",
        "video",
      ].includes(tag)
    ) {
      pushHtmlBlock(element.outerHTML);
      return;
    }

    if (["li", "span", "strong", "em", "a", "u", "b", "i"].includes(tag)) {
      pushTextBlock(inlineNodeToMarkdown(element));
      return;
    }

    const children = Array.from(element.childNodes);
    if (children.length === 0) {
      pushTextBlock(inlineNodeToMarkdown(element));
      return;
    }

    children.forEach(visitNode);
  };

  Array.from(documentRoot.body.childNodes).forEach(visitNode);
  return blocks;
}

function buildTableHtml(block: Extract<BlogContentBlock, { type: "table" }>) {
  const headersHtml = block.headers
    .map(
      (header) =>
        `<th style="border: 1px solid #d1d5db; padding: 8px; background: #f3f4f6;">${markdownToHtml(header)}</th>`,
    )
    .join("");
  const rowsHtml = block.rows
    .map(
      (row) =>
        `<tr>${row
          .map(
            (cell) =>
              `<td style="border: 1px solid #d1d5db; padding: 8px; vertical-align: top;">${markdownToHtml(cell)}</td>`,
          )
          .join("")}</tr>`,
    )
    .join("");

  return `
    <figure style="margin: 24px 0;">
      <figcaption style="margin-bottom: 8px; font-weight: 600; color: #2F3E3E;">
        ${markdownToHtml(block.title)}
      </figcaption>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db;">
        <thead>${headersHtml ? `<tr>${headersHtml}</tr>` : ""}</thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </figure>
  `;
}

function convertBlocksToEditorHtml(content: BlogEntry["content"]) {
  return content
    .map((block) => {
      if (typeof block === "string") {
        return `<p>${markdownToHtml(block)}</p>`;
      }

      if (block.type === "heading") {
        return `<h${block.level}>${markdownToHtml(block.text)}</h${block.level}>`;
      }

      if (block.type === "html") {
        return block.html;
      }

      if (block.type === "table") {
        return buildTableHtml(block);
      }

      if (block.type === "youtube") {
        return createYouTubePlaceholderHtml(block.url, block.title);
      }

      return `<p><a href="${escapeHtml(block.url)}" target="_blank" rel="noreferrer">${markdownToHtml(block.title)}</a></p>`;
    })
    .join("");
}

export default function BlogDraftEditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const selectedMediaRef = useRef<HTMLElement | null>(null);
  const editorCanvasRef = useRef<HTMLDivElement>(null);
  const selectedTableRef = useRef<HTMLTableElement | null>(null);
  const selectedCellRef = useRef<HTMLTableCellElement | null>(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [fontFamily, setFontFamily] = useState(fontFamilies[0].value);
  const [fontSize, setFontSize] = useState(fontSizes[2].value);
  const [lineSpacing, setLineSpacing] = useState(defaultLineSpacing);
  const [paragraphSpacing, setParagraphSpacing] = useState(defaultParagraphSpacing);
  const [editorHtml, setEditorHtml] = useState("");
  const [saveMessage, setSaveMessage] = useState("Not saved yet");
  const [hasSelectedTable, setHasSelectedTable] = useState(false);
  const [tableMenuOpen, setTableMenuOpen] = useState(false);
  const [tableMenuPosition, setTableMenuPosition] = useState({ top: 0, left: 0 });
  const [coverImage, setCoverImage] = useState(() =>
    getDefaultBlogCover(defaultTitle),
  );
  const [hasCustomCover, setHasCustomCover] = useState(false);
  const hasVisibleContent = editorHtml.replace(/<[^>]*>/g, "").trim().length > 0;
  const editSlugFromRoute = (
    (location.state as { editSlug?: string } | null)?.editSlug ?? ""
  ).trim();

  useEffect(() => {
    if (hasCustomCover) return;
    setCoverImage(getDefaultBlogCover(title));
  }, [hasCustomCover, title]);

  useEffect(() => {
    if (editSlugFromRoute) {
      const blogToEdit = mergePublishedAndSeedBlogs(getPublishedBlogs()).find(
        (blog) => blog.slug === editSlugFromRoute,
      );

      if (blogToEdit) {
        const convertedHtml = convertBlocksToEditorHtml(blogToEdit.content);
        setEditingSlug(blogToEdit.slug);
        setTitle(blogToEdit.title);
        setSummary(blogToEdit.summary);
        setEditorHtml(convertedHtml);
        setCoverImage(blogToEdit.image || getDefaultBlogCover(blogToEdit.title));
        setHasCustomCover(Boolean(blogToEdit.image));
        setSaveMessage(`Editing "${blogToEdit.title}"`);

        if (editorRef.current) {
          editorRef.current.innerHTML = convertedHtml;
        }
        return;
      }
    }

    const savedDraft = localStorage.getItem(getDraftStorageKey(user?.email));

    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft) as {
          title: string;
          summary: string;
          fontFamily: string;
          fontSize: string;
          lineSpacing?: number;
          paragraphSpacing?: number;
          content: string;
          editingSlug?: string;
          coverImage?: string;
          hasCustomCover?: boolean;
          savedAt: string;
        };

        const normalizedTitle = normalizeDraftTitle(parsed.title);
        const normalizedSummary = normalizeDraftSummary(parsed.summary);
        const normalizedContent = normalizeDraftContent(parsed.content);

        setTitle(normalizedTitle);
        setSummary(normalizedSummary);
        setEditingSlug(parsed.editingSlug?.trim() || null);
        setFontFamily(parsed.fontFamily);
        setFontSize(parsed.fontSize);
        setLineSpacing(
          typeof parsed.lineSpacing === "number"
            ? parsed.lineSpacing
            : defaultLineSpacing,
        );
        setParagraphSpacing(
          typeof parsed.paragraphSpacing === "number"
            ? parsed.paragraphSpacing
            : defaultParagraphSpacing,
        );
        setEditorHtml(normalizedContent);
        setHasCustomCover(Boolean(parsed.hasCustomCover && parsed.coverImage));
        setCoverImage(
          parsed.coverImage && parsed.coverImage.trim().length > 0
            ? parsed.coverImage
            : getDefaultBlogCover(normalizedTitle || defaultTitle),
        );
        setSaveMessage(`Saved ${new Date(parsed.savedAt).toLocaleString()}`);

        if (editorRef.current) {
          editorRef.current.innerHTML = normalizedContent;
        }
        return;
      } catch {
        localStorage.removeItem(getDraftStorageKey(user?.email));
      }
    }

    if (editorRef.current && !editorRef.current.innerHTML.trim()) {
      editorRef.current.innerHTML = "";
      setEditorHtml("");
    }

    setCoverImage(getDefaultBlogCover(title || defaultTitle));
  }, [editSlugFromRoute, user?.email]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    const closeMenu = () => setTableMenuOpen(false);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    return () => {
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
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

  const clearSelectedMedia = () => {
    if (!selectedMediaRef.current) return;
    selectedMediaRef.current.style.outline = "";
    selectedMediaRef.current.style.outlineOffset = "";
    selectedMediaRef.current = null;
  };

  const clearSelectedTable = () => {
    selectedTableRef.current = null;
    selectedCellRef.current = null;
    setHasSelectedTable(false);
    setTableMenuOpen(false);
  };

  const updateTableMenuPosition = (table: HTMLTableElement) => {
    const canvas = editorCanvasRef.current;
    if (!canvas) return;
    const tableRect = table.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    setTableMenuPosition({
      top: tableRect.top - canvasRect.top + canvas.scrollTop - 12,
      left: tableRect.left - canvasRect.left + canvas.scrollLeft - 12,
    });
  };

  const getTableCellFromTarget = (target: HTMLElement) =>
    target.closest("td, th") as HTMLTableCellElement | null;

  const getSelectedTable = () => selectedTableRef.current;
  const getSelectedCell = () => {
    if (selectedCellRef.current) return selectedCellRef.current;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const node = selection.getRangeAt(0).startContainer;
    const parent =
      node.nodeType === Node.ELEMENT_NODE
        ? (node as HTMLElement)
        : node.parentElement;
    return parent?.closest("td, th") as HTMLTableCellElement | null;
  };

  const normalizeTableStyles = (table: HTMLTableElement) => {
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.border = "1px solid #d1d5db";
    Array.from(table.querySelectorAll("th")).forEach((th) => {
      const cell = th as HTMLTableCellElement;
      cell.style.border = "1px solid #d1d5db";
      cell.style.padding = cell.style.padding || "8px";
      cell.style.background = cell.style.background || "#f3f4f6";
      cell.style.verticalAlign = "top";
    });
    Array.from(table.querySelectorAll("td")).forEach((td) => {
      const cell = td as HTMLTableCellElement;
      cell.style.border = "1px solid #d1d5db";
      cell.style.padding = cell.style.padding || "8px";
      cell.style.verticalAlign = "top";
    });
  };

  const runTableAction = (
    action: (table: HTMLTableElement, cell: HTMLTableCellElement | null) => void,
  ) => {
    const table = getSelectedTable();
    if (!table) return;
    const cell = getSelectedCell();
    action(table, cell);
    normalizeTableStyles(table);
    updateTableMenuPosition(table);
    syncEditorHtml();
    setTableMenuOpen(false);
  };

  const setSelectedMedia = (element: HTMLElement | null) => {
    if (selectedMediaRef.current === element) return;
    clearSelectedMedia();
    if (!element) return;
    selectedMediaRef.current = element;
    selectedMediaRef.current.style.outline = "2px solid #2CA4A4";
    selectedMediaRef.current.style.outlineOffset = "2px";
  };

  const removeMediaElement = (element: HTMLElement) => {
    const nextElement = element.nextElementSibling as HTMLElement | null;
    clearSelectedMedia();
    element.remove();
    if (
      nextElement &&
      nextElement.tagName.toLowerCase() === "p" &&
      nextElement.innerHTML.trim().toLowerCase() === "<br>"
    ) {
      nextElement.remove();
    }
    syncEditorHtml();
  };

  const getMediaFromNode = (node: Node | null) => {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return null;
    const element = node as HTMLElement;
    if (element.matches("[data-media-block='true']")) return element;
    return element.querySelector("[data-media-block='true']") as HTMLElement | null;
  };

  const resolveAdjacentMediaBlock = (
    range: Range,
    direction: "backward" | "forward",
  ) => {
    if (range.startContainer.nodeType === Node.TEXT_NODE) {
      const textNode = range.startContainer as Text;
      const parent = textNode.parentElement;
      if (!parent) return null;

      const atStart = range.startOffset === 0;
      const atEnd = range.startOffset === textNode.length;
      if (direction === "backward" && atStart) {
        return getMediaFromNode(parent.previousSibling);
      }
      if (direction === "forward" && atEnd) {
        return getMediaFromNode(parent.nextSibling);
      }
      return null;
    }

    const element = range.startContainer as Element;
    const index = range.startOffset;
    if (direction === "backward") {
      const previousNode =
        index > 0 ? element.childNodes[index - 1] : element.previousSibling;
      return getMediaFromNode(previousNode);
    }

    const nextNode =
      index < element.childNodes.length
        ? element.childNodes[index]
        : element.nextSibling;
    return getMediaFromNode(nextNode);
  };

  const insertTable = () => {
    const rowsInput = window.prompt("Number of rows", "3");
    const columnsInput = window.prompt("Number of columns", "3");

    const rows = Math.min(10, Math.max(2, Number(rowsInput) || 3));
    const columns = Math.min(8, Math.max(2, Number(columnsInput) || 3));

    const headers = Array.from({ length: columns }, (_, index) => `Column ${index + 1}`);
    const bodyRows = Array.from({ length: rows - 1 }, () =>
      Array.from({ length: columns }, () => "&nbsp;"),
    );

    const tableHtml = `
      <figure style="margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db;">
          <thead>
            <tr>
              ${headers
                .map(
                  (header) =>
                    `<th style="border: 1px solid #d1d5db; padding: 8px; background: #f3f4f6;">${header}</th>`,
                )
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${bodyRows
              .map(
                (row) =>
                  `<tr>${row
                    .map(
                      (cell) =>
                        `<td style="border: 1px solid #d1d5db; padding: 8px; vertical-align: top;">${cell}</td>`,
                    )
                    .join("")}</tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </figure>
      <p><br /></p>
    `;

    insertHtmlAtCursor(tableHtml);
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
          <figure data-media-block="true" contenteditable="false" style="margin: 24px 0;">
            <div style="width: min(100%, 760px); max-width: 100%; min-width: 180px; resize: both; overflow: auto; border: 1px dashed #9ca3af; border-radius: 18px; padding: 4px;">
              <img src="${url}" alt="${file.name}" style="width: 100%; height: auto; display: block; border-radius: 14px;" />
            </div>
            <figcaption style="margin-top: 8px; color: #6b7280; font-size: 14px;">${file.name}</figcaption>
          </figure>
          <p><br /></p>
        `);
      } else {
        insertHtmlAtCursor(`
          <figure data-media-block="true" contenteditable="false" style="margin: 24px 0;">
            <div style="width: min(100%, 760px); max-width: 100%; min-width: 220px; resize: both; overflow: auto; border: 1px dashed #9ca3af; border-radius: 18px; padding: 4px;">
              <video controls style="width: 100%; height: auto; display: block; border-radius: 14px;">
                <source src="${url}" type="${file.type}" />
              </video>
            </div>
            <figcaption style="margin-top: 8px; color: #6b7280; font-size: 14px;">${file.name}</figcaption>
          </figure>
          <p><br /></p>
        `);
      }
    });

    event.target.value = "";
  };

  const handleCoverImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setCoverImage(dataUrl);
      setHasCustomCover(true);
    } catch {
      setSaveMessage("Could not load cover image");
    }
  };

  const insertYoutubeEmbed = (embedUrl: string) => {
    insertHtmlAtCursor(createYouTubePlaceholderHtml(embedUrl));
  };

  const handleDocumentUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const fileName = file.name.toLowerCase();
      let importedHtml = "";

      if (fileName.endsWith(".docx")) {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            convertImage: mammoth.images.imgElement((image) =>
              image.read("base64").then((buffer) => ({
                src: `data:${image.contentType};base64,${buffer}`,
              })),
            ),
          },
        );
        importedHtml = result.value;
      } else if (fileName.endsWith(".html") || fileName.endsWith(".htm")) {
        const htmlText = await file.text();
        const parsed = new DOMParser().parseFromString(htmlText, "text/html");
        importedHtml = parsed.body.innerHTML || htmlText;
      } else {
        const textContent = await file.text();
        importedHtml = `<p>${escapeHtml(textContent).replace(/\n/g, "<br />")}</p>`;
      }

      if (!importedHtml.trim()) {
        setSaveMessage("Document import had no readable content");
        return;
      }

      insertHtmlAtCursor(`
        <section style="margin: 16px 0;">
          ${importedHtml}
        </section>
        <p><br /></p>
      `);
      setSaveMessage(`Imported ${file.name}`);
    } catch {
      setSaveMessage("Could not import document");
    }
  };

  const handleEditorPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const pastedText = event.clipboardData.getData("text").trim();
    const embedUrl = normaliseYouTubeUrl(pastedText);

    if (!embedUrl) return;

    event.preventDefault();
    insertYoutubeEmbed(embedUrl);
  };

  const addTableRow = (table: HTMLTableElement, cell: HTMLTableCellElement | null, after: boolean) => {
    const row = cell?.parentElement as HTMLTableRowElement | null;
    const sourceRow =
      row ??
      (table.rows.length > 0 ? (table.rows[0] as HTMLTableRowElement) : null);
    if (!sourceRow) return;

    const rowIndex = sourceRow.rowIndex;
    const insertIndex = after ? rowIndex + 1 : rowIndex;
    const newRow = table.insertRow(insertIndex);
    Array.from(sourceRow.cells).forEach((sourceCell) => {
      const tag = sourceCell.tagName.toLowerCase() === "th" ? "th" : "td";
      const newCell = document.createElement(tag);
      newCell.innerHTML = "&nbsp;";
      newRow.appendChild(newCell);
    });
  };

  const addTableColumn = (
    table: HTMLTableElement,
    cell: HTMLTableCellElement | null,
    after: boolean,
  ) => {
    const index = cell?.cellIndex ?? 0;
    Array.from(table.rows).forEach((row) => {
      const insertIndex = after ? index + 1 : index;
      const referenceCell = row.cells[Math.max(0, Math.min(index, row.cells.length - 1))];
      const tag = referenceCell?.tagName.toLowerCase() === "th" ? "th" : "td";
      const newCell = document.createElement(tag);
      newCell.innerHTML = "&nbsp;";
      if (insertIndex >= row.cells.length) {
        row.appendChild(newCell);
      } else {
        row.insertBefore(newCell, row.cells[insertIndex]);
      }
    });
  };

  const deleteTableRow = (table: HTMLTableElement, cell: HTMLTableCellElement | null) => {
    if (!cell) return;
    if (table.rows.length <= 1) return;
    table.deleteRow((cell.parentElement as HTMLTableRowElement).rowIndex);
  };

  const deleteTableColumn = (table: HTMLTableElement, cell: HTMLTableCellElement | null) => {
    if (!cell) return;
    const colIndex = cell.cellIndex;
    const minCols = Math.min(...Array.from(table.rows).map((row) => row.cells.length));
    if (minCols <= 1) return;
    Array.from(table.rows).forEach((row) => {
      if (row.cells[colIndex]) row.deleteCell(colIndex);
    });
  };

  const setRowHeight = (table: HTMLTableElement, cell: HTMLTableCellElement | null) => {
    if (!cell) return;
    const row = cell.parentElement as HTMLTableRowElement;
    const input = window.prompt("Row height in px", row.style.height.replace("px", "") || "42");
    if (!input) return;
    const height = Math.max(24, Number(input) || 42);
    row.style.height = `${height}px`;
  };

  const setCellPadding = (table: HTMLTableElement) => {
    const firstCell = table.querySelector("th, td") as HTMLTableCellElement | null;
    const currentPadding = firstCell?.style.padding.replace("px", "") || "8";
    const input = window.prompt("Cell padding in px", currentPadding);
    if (!input) return;
    const padding = Math.max(2, Number(input) || 8);
    Array.from(table.querySelectorAll("th, td")).forEach((tableCell) => {
      (tableCell as HTMLTableCellElement).style.padding = `${padding}px`;
    });
  };

  const deleteWholeTable = (table: HTMLTableElement) => {
    const figure = table.closest("figure");
    if (figure) {
      figure.remove();
    } else {
      table.remove();
    }
    clearSelectedTable();
  };

  const handleEditorClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const table = target.closest("table") as HTMLTableElement | null;
    const tableCell = getTableCellFromTarget(target);
    if (table) {
      selectedTableRef.current = table;
      selectedCellRef.current = tableCell;
      setHasSelectedTable(true);
      updateTableMenuPosition(table);
    } else {
      clearSelectedTable();
    }

    const mediaBlock = target.closest("[data-media-block='true']") as HTMLElement | null;
    setSelectedMedia(mediaBlock);
    if (mediaBlock) {
      clearSelectedTable();
    }
  };

  const handleEditorKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Backspace" && event.key !== "Delete") return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    if (selectedMediaRef.current) {
      event.preventDefault();
      removeMediaElement(selectedMediaRef.current);
      return;
    }

    if (!selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    const adjacent =
      event.key === "Backspace"
        ? resolveAdjacentMediaBlock(range, "backward")
        : resolveAdjacentMediaBlock(range, "forward");

    if (!adjacent) return;
    event.preventDefault();
    removeMediaElement(adjacent);
  };

  const handleResetDraft = () => {
    clearSelectedMedia();
    setTitle("");
    setSummary("");
    setEditingSlug(null);
    setFontFamily(fontFamilies[0].value);
    setFontSize(fontSizes[2].value);
    setLineSpacing(defaultLineSpacing);
    setParagraphSpacing(defaultParagraphSpacing);
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    setEditorHtml("");
    setHasCustomCover(false);
    setCoverImage(getDefaultBlogCover(defaultTitle));
    localStorage.removeItem(getDraftStorageKey(user?.email));
    setSaveMessage("Draft reset");
  };

  const handleSaveDraft = () => {
    const content = editorRef.current?.innerHTML ?? editorHtml;
    const savedAt = new Date().toISOString();

    localStorage.setItem(
      getDraftStorageKey(user?.email),
      JSON.stringify({
        title: title.trim() || defaultTitle,
        summary: summary.trim() || defaultSummary,
        editingSlug,
        fontFamily,
        fontSize,
        lineSpacing,
        paragraphSpacing,
        content,
        coverImage,
        hasCustomCover,
        savedAt,
      }),
    );

    setEditorHtml(content);
    setSaveMessage(`Saved ${new Date(savedAt).toLocaleString()}`);
    navigate("/dashboard/writing-blogs", {
      state: { saveSuccessMessage: "Draft saved successfully." },
    });
  };

  const handlePublishDraft = async () => {
    const content = editorRef.current?.innerHTML ?? editorHtml;
    const savedAt = new Date().toISOString();
    const structuredContent = parseEditorHtmlToBlocks(content);
    const existingBlog =
      editingSlug
        ? mergePublishedAndSeedBlogs(getPublishedBlogs()).find(
            (blog) => blog.slug === editingSlug,
          )
        : null;

    localStorage.setItem(
      getDraftStorageKey(user?.email),
      JSON.stringify({
        title,
        summary,
        editingSlug,
        fontFamily,
        fontSize,
        lineSpacing,
        paragraphSpacing,
        content,
        coverImage,
        hasCustomCover,
        savedAt,
      }),
    );

    const publishedBlog = {
      slug:
        editingSlug ||
        slugify(title || defaultTitle) ||
        `published-${Date.now()}`,
      title: title.trim() || defaultTitle,
      summary: summary.trim() || defaultSummary,
      author: existingBlog?.author ?? user?.name ?? "Unknown Author",
      authorEmail:
        existingBlog?.authorEmail ?? user?.email ?? "guest@example.com",
      image: coverImage || getDefaultBlogCover(title || defaultTitle),
      content: structuredContent.length
        ? structuredContent
        : ["This published blog is ready to be expanded with your final content."],
      viewCount: existingBlog?.viewCount ?? 0,
      likedBy: existingBlog?.likedBy ?? [],
      comments: existingBlog?.comments ?? [],
    };

    savePublishedBlog(publishedBlog);
    await savePublishedBlogAsync(publishedBlog);

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

  const headingButtons = [
    {
      label: "H1",
      action: () => {
        runCommand("formatBlock", "H1");
        runCommand("bold");
      },
    },
    {
      label: "H2",
      action: () => {
        runCommand("formatBlock", "H2");
        runCommand("bold");
      },
    },
  ];

  const iconToolbarButtons = [
    { icon: Undo2, action: () => runCommand("undo"), label: "Undo" },
    { icon: Redo2, action: () => runCommand("redo"), label: "Redo" },
  ];

  const indentationButtons = [
    { label: "Indent +", action: () => runCommand("indent") },
    { label: "Indent -", action: () => runCommand("outdent") },
  ];

  const formatButtons = textToolbarButtons.filter((button) =>
    ["Bold", "Italic", "Underline"].includes(button.label),
  );
  const alignmentButtons = textToolbarButtons.filter((button) =>
    ["Left", "Center", "Right"].includes(button.label),
  );
  const listButtons = textToolbarButtons.filter((button) =>
    ["Bullets", "Numbered"].includes(button.label),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <style>{`
        .draft-rich-editor p,
        .draft-rich-editor h1,
        .draft-rich-editor h2,
        .draft-rich-editor h3,
        .draft-rich-editor blockquote,
        .draft-rich-editor pre,
        .draft-rich-editor figure,
        .draft-rich-editor table {
          margin-top: 0;
          margin-bottom: var(--paragraph-gap, 14px);
        }

        .draft-rich-editor ul,
        .draft-rich-editor ol {
          margin-top: 0;
          margin-bottom: var(--paragraph-gap, 14px);
          padding-left: 1.75rem;
          list-style-position: outside;
        }

        .draft-rich-editor ul {
          list-style-type: disc !important;
        }

        .draft-rich-editor ol {
          list-style-type: decimal !important;
        }

        .draft-rich-editor li {
          margin: 0 0 4px 0;
        }
      `}</style>
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
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#2F3E3E] outline-none transition placeholder:text-gray-300 focus:border-[#2CA4A4] focus:ring-4 focus:ring-[#2CA4A4]/10"
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
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#2F3E3E] outline-none transition placeholder:text-gray-300 focus:border-[#2CA4A4] focus:ring-4 focus:ring-[#2CA4A4]/10"
                  placeholder="Write a short summary"
                />
              </label>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="block text-sm font-medium text-[#2F3E3E]">
                    Cover image
                  </span>
                  <button
                    type="button"
                    onClick={() => coverImageInputRef.current?.click()}
                    className="rounded-full border border-[#2CA4A4]/25 px-3 py-1.5 text-xs font-semibold text-[#2CA4A4] transition hover:bg-[#2CA4A4]/10"
                  >
                    Upload image
                  </button>
                </div>
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-[#F7FAFA]">
                  <div className="aspect-[16/10]">
                    <img
                      src={coverImage}
                      alt="Draft cover preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <p className="text-xs leading-5 text-gray-500">
                      If you do not upload a cover, a stock education image is
                      used automatically when the draft is published.
                    </p>
                    {hasCustomCover && (
                      <button
                        type="button"
                        onClick={() => {
                          setHasCustomCover(false);
                          setCoverImage(getDefaultBlogCover(title));
                        }}
                        className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#2F3E3E] transition hover:bg-white"
                      >
                        Use stock image
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="rounded-[2rem] border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <div className="flex flex-col gap-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-none p-0 text-3xl font-bold text-[#2F3E3E] outline-none placeholder:text-[#2F3E3E]"
                  placeholder={defaultTitle}
                />
              <p className={summary ? "text-sm text-gray-500" : "text-sm text-[#2F3E3E]"}>
                {summary || defaultSummary}
              </p>
              <div className="grid gap-3 border-t border-gray-100 pt-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-[#FCFEFE] p-3">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6b7d82]">
                    Typography
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
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
                    {formatButtons.map(({ icon: Icon, action, label }) => (
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
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#FCFEFE] p-3">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6b7d82]">
                    Spacing
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#2F3E3E]">
                      <span>Line</span>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={lineSpacing}
                        onChange={(event) => setLineSpacing(Number(event.target.value))}
                        className="h-2 w-24 accent-[#2CA4A4]"
                        title="Line spacing"
                      />
                      <span className="w-8 text-right">{lineSpacing.toFixed(1)}</span>
                    </label>
                    <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#2F3E3E]">
                      <span>Para</span>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        step="1"
                        value={paragraphSpacing}
                        onChange={(event) => setParagraphSpacing(Number(event.target.value))}
                        className="h-2 w-24 accent-[#2CA4A4]"
                        title="Paragraph spacing"
                      />
                      <span className="w-10 text-right">{paragraphSpacing}px</span>
                    </label>
                    {indentationButtons.map(({ label, action }) => (
                      <button
                        key={label}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={action}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-[#2F3E3E] transition hover:border-[#2CA4A4]/40 hover:text-[#2CA4A4]"
                        aria-label={label}
                        title={label}
                      >
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#FCFEFE] p-3">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6b7d82]">
                    Layout
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {alignmentButtons.map(({ icon: Icon, action, label }) => (
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
                    {listButtons.map(({ icon: Icon, action, label }) => (
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
                    {headingButtons.map(({ label, action }) => (
                      <button
                        key={label}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={action}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#2F3E3E] transition hover:border-[#2CA4A4]/40 hover:text-[#2CA4A4]"
                        aria-label={label}
                        title={label}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#FCFEFE] p-3">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6b7d82]">
                    Actions
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {iconToolbarButtons.map(({ icon: Icon, action, label }) => (
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
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={insertTable}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#2F3E3E] transition hover:border-[#2CA4A4]/40 hover:text-[#2CA4A4]"
                    >
                      <Table2 size={16} />
                      Table
                    </button>
                    <button
                      type="button"
                      onClick={() => documentInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#2F3E3E] transition hover:border-[#2CA4A4]/40 hover:text-[#2CA4A4]"
                    >
                      <FileUp size={16} />
                      Document
                    </button>
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
            </div>
          </div>

          <input
            ref={coverImageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverImageUpload}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => handleAssetUpload(event, "image")}
          />
          <input
            ref={documentInputRef}
            type="file"
            accept=".docx,.html,.htm,.txt,.md"
            className="hidden"
            onChange={(event) => void handleDocumentUpload(event)}
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
              <div
                ref={editorCanvasRef}
                className="relative mx-auto min-h-[720px] max-w-4xl rounded-[1.5rem] border border-[#E8E0D1] bg-white px-6 py-8 shadow-[0_20px_60px_rgba(47,62,62,0.08)] sm:px-10"
              >
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
                  <Type size={16} />
                  Rich text blog canvas
                </div>
                {hasSelectedTable && (
                  <div
                    className="absolute z-20"
                    style={{ top: tableMenuPosition.top, left: tableMenuPosition.left }}
                  >
                    <div className="relative">
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => setTableMenuOpen((current) => !current)}
                        className="rounded-md border border-[#2CA4A4]/35 bg-white px-2 py-1 text-xs font-semibold text-[#1f4f56] shadow-sm hover:bg-[#ecfdfd]"
                        title="Table options"
                      >
                        Table ▾
                      </button>
                      {tableMenuOpen && (
                        <div className="absolute left-0 top-8 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                          <button type="button" onClick={() => runTableAction((table, cell) => addTableRow(table, cell, false))} className="block w-full px-3 py-2 text-left text-xs hover:bg-[#F3FAFA]">Add row above</button>
                          <button type="button" onClick={() => runTableAction((table, cell) => addTableRow(table, cell, true))} className="block w-full px-3 py-2 text-left text-xs hover:bg-[#F3FAFA]">Add row below</button>
                          <button type="button" onClick={() => runTableAction((table, cell) => deleteTableRow(table, cell))} className="block w-full px-3 py-2 text-left text-xs hover:bg-[#FFF4F4]">Delete row</button>
                          <button type="button" onClick={() => runTableAction((table, cell) => addTableColumn(table, cell, false))} className="block w-full px-3 py-2 text-left text-xs hover:bg-[#F3FAFA]">Add column left</button>
                          <button type="button" onClick={() => runTableAction((table, cell) => addTableColumn(table, cell, true))} className="block w-full px-3 py-2 text-left text-xs hover:bg-[#F3FAFA]">Add column right</button>
                          <button type="button" onClick={() => runTableAction((table, cell) => deleteTableColumn(table, cell))} className="block w-full px-3 py-2 text-left text-xs hover:bg-[#FFF4F4]">Delete column</button>
                          <button type="button" onClick={() => runTableAction((table, cell) => setRowHeight(table, cell))} className="block w-full px-3 py-2 text-left text-xs hover:bg-[#F3FAFA]">Set row height...</button>
                          <button type="button" onClick={() => runTableAction((table) => setCellPadding(table))} className="block w-full px-3 py-2 text-left text-xs hover:bg-[#F3FAFA]">Set cell padding...</button>
                          <button type="button" onClick={() => runTableAction((table) => deleteWholeTable(table))} className="block w-full px-3 py-2 text-left text-xs font-semibold text-[#9A3D3D] hover:bg-[#FFF4F4]">Delete table</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={syncEditorHtml}
                  onPaste={handleEditorPaste}
                  onClick={handleEditorClick}
                  onKeyDown={handleEditorKeyDown}
                  onBlur={saveSelection}
                  onKeyUp={saveSelection}
                  onMouseUp={saveSelection}
                  className="draft-rich-editor min-h-[580px] outline-none"
                  style={{
                    fontFamily,
                    fontSize,
                    lineHeight: lineSpacing,
                    ["--paragraph-gap" as any]: `${paragraphSpacing}px`,
                    color: "#2F3E3E",
                  }}
                />
                {!hasVisibleContent && (
                  <div className="pointer-events-none absolute left-10 top-24 space-y-2 text-gray-300">
                    <p className="text-2xl font-semibold">{editorPlaceholderTitle}</p>
                    <p className="max-w-2xl text-base leading-7">
                      {editorPlaceholderDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

