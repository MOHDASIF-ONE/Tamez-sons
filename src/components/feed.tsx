"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  Bell,
  Bookmark,
  Camera,
  Check,
  ChevronDown,
  Compass,
  Heart,
  Home,
  ImagePlus,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings2,
  Sparkles,
  X,
} from "lucide-react";
import { AmbientOrb } from "@/components/ambient-orb";
import { ScrollEffects } from "@/components/scroll-effects";
import { Button } from "@/components/ui/button";

const people = [
  {
    handle: "marin.rose",
    name: "Marin Rose",
    avatar: "photo-1534528741775-53994a69daeb",
    online: true,
  },
  {
    handle: "kai.studio",
    name: "Kai Bennett",
    avatar: "photo-1500648767791-00dcc994a43e",
    online: false,
  },
  {
    handle: "itsnina",
    name: "Nina Sol",
    avatar: "photo-1531123897727-8f129e1688ce",
    online: false,
  },
  {
    handle: "leo.frames",
    name: "Leo Martins",
    avatar: "photo-1506794778202-cad84cf45f1d",
    online: true,
  },
  {
    handle: "studio__june",
    name: "June Park",
    avatar: "photo-1517841905240-472988babdf9",
    online: false,
  },
];

type Post = {
  id: number;
  user: (typeof people)[number];
  location: string;
  image: string;
  caption: string;
  likes: number;
  time: string;
  liked: boolean;
  saved: boolean;
  comments: string[];
};
const initialPosts: Post[] = [
  {
    id: 1,
    user: people[0],
    location: "Big Sur, California",
    image: "photo-1470770841072-f978cf4d019e",
    caption:
      "Somewhere between the ocean and the sky, I remembered to slow down. 🌊",
    likes: 2486,
    time: "2 hours ago",
    liked: false,
    saved: false,
    comments: ["this light is unreal", "adding this to my list ✨"],
  },
  {
    id: 2,
    user: people[1],
    location: "Atelier no. 04",
    image: "photo-1494438639946-1ebd1d20bf85",
    caption: "Sunday rituals & a very good cup of coffee.",
    likes: 842,
    time: "5 hours ago",
    liked: false,
    saved: false,
    comments: ["the coziest corner"],
  },
];

const postSchema = z.object({
  caption: z
    .string()
    .min(1, "Add a caption before sharing.")
    .max(2200, "Keep your caption under 2,200 characters."),
});
type PostForm = z.infer<typeof postSchema>;

function photo(id: string, width = 96) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&h=${width}&q=82`;
}

export function Feed() {
  const [posts, setPosts] = useState(initialPosts);
  const [following, setFollowing] = useState<string[]>([]);
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState<Record<number, string>>({});
  const reduceMotion = useReducedMotion();
  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: { caption: "" },
  });

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const toggleLike = (id: number) =>
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1),
            }
          : post,
      ),
    );
  const toggleSave = (id: number) =>
    setPosts((current) =>
      current.map((post) =>
        post.id === id ? { ...post, saved: !post.saved } : post,
      ),
    );
  const addComment = (id: number) => {
    const comment = commentDraft[id]?.trim();
    if (!comment) return;
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? { ...post, comments: [...post.comments, comment] }
          : post,
      ),
    );
    setCommentDraft((current) => ({ ...current, [id]: "" }));
  };
  const createPost = form.handleSubmit(({ caption }) => {
    setPosts((current) => [
      {
        id: Date.now(),
        user: { ...people[2], handle: "you", name: "You" },
        location: "Just now",
        image: "photo-1470252649378-9c29740c9fa8",
        caption,
        likes: 0,
        time: "just now",
        liked: false,
        saved: false,
        comments: [],
      },
      ...current,
    ]);
    setDialogOpen(false);
    form.reset();
    setToast("Your moment is live");
  });

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#20211f]">
      <ScrollEffects />
      <header className="fixed inset-x-0 top-0 z-30 flex h-[66px] items-center justify-between border-b border-[#e9e7e1]/80 bg-[#f7f6f2]/90 px-5 backdrop-blur-xl md:hidden">
        <a href="#home" className="font-serif text-[25px] tracking-[-1.5px]">
          socia<span className="text-[#e9563f]">.</span>
        </a>
        <div className="flex items-center gap-2">
          <button
            aria-label="Notifications"
            className="relative rounded-full p-2.5 hover:bg-[#eeede8]"
            onClick={() => setToast("You’re all caught up")}
          >
            <Bell size={19} />
            <i className="absolute top-2 right-2 size-1.5 rounded-full bg-[#e9563f]" />
          </button>
          <button
            aria-label="Create a post"
            className="rounded-full bg-[#20211f] p-2.5 text-white"
            onClick={() => setDialogOpen(true)}
          >
            <Plus size={19} />
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[220px_minmax(0,620px)] lg:grid-cols-[220px_minmax(0,620px)_300px]">
        <aside className="fixed right-0 bottom-0 left-0 z-30 flex h-[66px] items-center justify-around border-t border-[#e9e7e1] bg-[#f7f6f2]/95 px-2 backdrop-blur-xl md:sticky md:top-0 md:col-start-1 md:row-start-1 md:h-screen md:flex-col md:items-stretch md:justify-start md:border-0 md:bg-transparent md:px-7 md:pt-9 md:pb-8">
          <a
            href="#home"
            className="mb-10 hidden font-serif text-[32px] tracking-[-2px] md:block"
          >
            socia<span className="text-[#e9563f]">.</span>
          </a>
          <nav className="flex w-full items-center justify-around md:flex-col md:items-stretch md:gap-1">
            {[
              [Home, "Home"],
              [Compass, "Explore"],
              [MessageCircle, "Messages"],
              [Bell, "Notifications"],
              [Bookmark, "Saved"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Home;
              const title = label as string;
              return (
                <button
                  key={title}
                  onClick={() =>
                    setToast(
                      title === "Home"
                        ? "You’re already home"
                        : `${title} is ready for your community`,
                    )
                  }
                  className={`group flex items-center gap-4 rounded-xl px-3 py-3 text-[14px] transition hover:bg-[#eeede8] ${title === "Home" ? "font-semibold" : "text-[#777771]"}`}
                >
                  <I size={20} strokeWidth={title === "Home" ? 2.3 : 1.8} />
                  <span className="hidden md:inline">{title}</span>
                  {title === "Notifications" && (
                    <span className="ml-auto hidden rounded-full bg-[#e9563f] px-2 py-0.5 text-[10px] text-white md:block">
                      3
                    </span>
                  )}
                </button>
              );
            })}
            <Button
              variant="accent"
              className="mt-4 hidden h-11 w-full rounded-xl md:flex"
              onClick={() => setDialogOpen(true)}
            >
              <Plus size={17} /> Create post
            </Button>
          </nav>
          <button
            onClick={() => setToast("Settings are coming soon")}
            className="mt-auto hidden items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#777771] hover:bg-[#eeede8] md:flex"
          >
            <Settings2 size={19} /> Settings{" "}
            <LogOut className="ml-auto" size={17} />
          </button>
        </aside>

        <section
          id="home"
          className="min-w-0 px-4 pt-[84px] pb-28 sm:px-8 md:col-start-2 md:row-start-1 md:px-7 md:pt-9 md:pb-16 lg:px-10"
        >
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[.22em] text-[#aaa8a1] uppercase">
                Your little corner
              </p>
              <h1 className="feed-heading mt-1 font-serif text-[31px] tracking-[-1.2px] sm:text-[35px]">
                Good morning, Alex <span className="text-[25px]">☀️</span>
              </h1>
            </div>
            <button
              aria-label="Search"
              className="hidden rounded-full border border-[#e5e3dc] bg-white p-3 text-[#666660] transition hover:-translate-y-0.5 md:block"
              onClick={() =>
                setToast("Search is ready to connect to Meilisearch")
              }
            >
              <Search size={18} />
            </button>
          </div>

          <div className="relative mb-8 overflow-hidden rounded-[23px] bg-[#232722] px-5 py-4 text-white sm:px-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,rgba(238,126,104,.27),transparent_34%),linear-gradient(110deg,#252a25,#252924_60%,#40342f)]" />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold tracking-[.2em] text-[#eab5a7] uppercase">
                  <Sparkles size={12} /> A little inspiration
                </div>
                <p className="max-w-[280px] font-serif text-[19px] leading-[1.22] tracking-[-.3px] sm:text-[21px]">
                  Make room for the things
                  <br className="hidden sm:block" /> that make you feel alive.
                </p>
                <button
                  onClick={() =>
                    setToast("One small moment is a good place to start")
                  }
                  className="mt-3 inline-flex items-center gap-1 text-[11px] text-white/65 transition hover:text-white"
                >
                  Find your moment{" "}
                  <ChevronDown size={13} className="-rotate-90" />
                </button>
              </div>
              <div className="relative hidden h-[100px] w-[110px] sm:block">
                <AmbientOrb />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold">
                The people you follow
              </h2>
              <button
                className="text-xs font-medium text-[#a09e97] hover:text-[#20211f]"
                onClick={() =>
                  setToast("You’re seeing everyone’s latest moments")
                }
              >
                See all
              </button>
            </div>
            <div className="flex [scrollbar-width:none] gap-4 overflow-x-auto pb-1">
              {[
                {
                  handle: "your-story",
                  name: "Your story",
                  avatar: "",
                  online: false,
                },
                ...people,
              ].map((person, index) => (
                <button
                  className="flex min-w-[62px] flex-col items-center gap-2"
                  key={person.handle}
                  onClick={() =>
                    index === 0
                      ? setDialogOpen(true)
                      : setActiveStory(person.handle)
                  }
                >
                  <span
                    className={`relative grid size-[57px] place-items-center rounded-full ${index === 0 ? "border border-dashed border-[#c9c6bc] bg-white" : "story-ring"}`}
                  >
                    {index === 0 ? (
                      <Plus size={18} className="text-[#aaa8a1]" />
                    ) : (
                      <Image
                        alt=""
                        src={photo(person.avatar, 120)}
                        width={120}
                        height={120}
                        sizes="48px"
                        className="size-[49px] rounded-full border-[2.5px] border-[#f7f6f2] object-cover"
                      />
                    )}
                    {person.online && (
                      <i className="absolute right-0.5 bottom-0.5 size-3 rounded-full border-2 border-[#f7f6f2] bg-[#72ad7d]" />
                    )}
                  </span>
                  <span className="w-[68px] truncate text-[10px] text-[#777771]">
                    {index === 0 ? "Your story" : person.handle}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between border-b border-[#e9e7e1] pb-3">
            <div className="flex gap-5">
              <button className="border-b-2 border-[#20211f] pb-3 text-[13px] font-semibold">
                For you
              </button>
              <button
                onClick={() => setToast("Following feed selected")}
                className="pb-3 text-[13px] text-[#aaa8a1] hover:text-[#555650]"
              >
                Following
              </button>
            </div>
            <button
              aria-label="Feed options"
              className="text-[#99978f]"
              onClick={() => setToast("Your feed is sorted by latest")}
            >
              <Settings2 size={17} />
            </button>
          </div>

          <div className="space-y-7">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="overflow-hidden rounded-[19px] border border-[#eae8e2] bg-white shadow-[0_8px_30px_rgba(47,43,32,.025)]"
              >
                <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                  <Image
                    src={photo(post.user.avatar, 100)}
                    width={100}
                    height={100}
                    sizes="40px"
                    alt={`${post.user.name} avatar`}
                    className="size-[38px] rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-semibold">
                        {post.user.handle}
                      </span>
                      {post.user.handle === "marin.rose" && (
                        <Check
                          size={12}
                          className="rounded-full bg-[#6d9da2] p-0.5 text-white"
                        />
                      )}
                    </div>
                    <span className="text-[10px] text-[#aaa8a1]">
                      {post.location}
                    </span>
                  </div>
                  <button
                    aria-label="More post options"
                    onClick={() => setToast("Post options opened")}
                    className="rounded-full p-2 text-[#99978f] hover:bg-[#f5f4ef]"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                <div className="relative aspect-[1.14/1] overflow-hidden bg-[#e4e3dc] sm:aspect-[1.2/1]">
                  <Image
                    src={`https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=1200&q=88`}
                    width={1200}
                    height={1200}
                    sizes="(max-width: 640px) 100vw, 620px"
                    preload={index === 0}
                    alt={post.caption}
                    className="size-full object-cover transition duration-700 hover:scale-[1.015]"
                  />
                  <button
                    aria-label={post.liked ? "Unlike post" : "Like post"}
                    onDoubleClick={() => {
                      if (!post.liked) toggleLike(post.id);
                    }}
                    className="absolute inset-0"
                  />
                </div>
                <div className="px-4 pt-3.5 pb-4 sm:px-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-[17px]">
                      <button
                        aria-label={post.liked ? "Unlike" : "Like"}
                        onClick={() => toggleLike(post.id)}
                        className={`transition hover:scale-110 ${post.liked ? "text-[#e9563f]" : "text-[#4d4e49]"}`}
                      >
                        <Heart
                          size={21}
                          fill={post.liked ? "currentColor" : "none"}
                        />
                      </button>
                      <button
                        aria-label="Comment"
                        onClick={() =>
                          document.getElementById(`comment-${post.id}`)?.focus()
                        }
                        className="text-[#4d4e49] transition hover:scale-110"
                      >
                        <MessageCircle size={20} />
                      </button>
                      <button
                        aria-label="Share post"
                        onClick={() => setToast("Link copied to clipboard")}
                        className="text-[#4d4e49] transition hover:scale-110"
                      >
                        <Send size={19} />
                      </button>
                    </div>
                    <button
                      aria-label={
                        post.saved ? "Remove saved post" : "Save post"
                      }
                      onClick={() => toggleSave(post.id)}
                      className={`transition hover:scale-110 ${post.saved ? "text-[#e9563f]" : "text-[#4d4e49]"}`}
                    >
                      <Bookmark
                        size={20}
                        fill={post.saved ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  <p className="mb-1 text-[12px] font-semibold">
                    {post.likes.toLocaleString()} appreciations
                  </p>
                  <p className="text-[12px] leading-[1.65]">
                    <span className="mr-1.5 font-semibold">
                      {post.user.handle}
                    </span>
                    {post.caption}
                  </p>
                  <button
                    className="mt-1 text-[11px] text-[#aaa8a1] hover:text-[#777771]"
                    onClick={() =>
                      document.getElementById(`comment-${post.id}`)?.focus()
                    }
                  >
                    View all {post.comments.length} comments
                  </button>
                  <div className="mt-1 space-y-1">
                    {post.comments.slice(-2).map((comment, index) => (
                      <p
                        key={`${comment}-${index}`}
                        className="text-[11px] text-[#64645e]"
                      >
                        <span className="mr-1.5 font-semibold">
                          {index === 0 ? "nina.sol" : "leo.frames"}
                        </span>
                        {comment}
                      </p>
                    ))}
                  </div>
                  <p className="mt-2 text-[9px] tracking-[.1em] text-[#b6b4ad] uppercase">
                    {post.time}
                  </p>
                  <form
                    className="mt-3 flex items-center border-t border-[#f0efeb] pt-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      addComment(post.id);
                    }}
                  >
                    <input
                      id={`comment-${post.id}`}
                      value={commentDraft[post.id] ?? ""}
                      onChange={(event) =>
                        setCommentDraft((current) => ({
                          ...current,
                          [post.id]: event.target.value,
                        }))
                      }
                      placeholder="Leave a little love…"
                      aria-label="Add a comment"
                      className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-[#b8b6af]"
                    />
                    <button
                      className="text-[11px] font-semibold text-[#d5a49a] hover:text-[#e9563f]"
                      type="submit"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </motion.article>
            ))}
          </div>
          <div className="py-8 text-center text-[11px] text-[#aaa8a1]">
            You’re all caught up <span className="text-[#e9563f]">✳</span>
          </div>
        </section>

        <aside className="hidden px-5 pt-10 pb-10 lg:col-start-3 lg:row-start-1 lg:block">
          <div className="sticky top-9">
            <div className="mb-8 flex items-center gap-3">
              <Image
                src={photo("photo-1534528741775-53994a69daeb", 100)}
                width={100}
                height={100}
                sizes="48px"
                alt="Your profile"
                className="size-[43px] rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold">alex.morgan</p>
                <p className="text-[10px] text-[#aaa8a1]">Alex Morgan</p>
              </div>
              <button
                className="text-[11px] font-semibold text-[#e9563f]"
                onClick={() => setToast("Profile switched")}
              >
                Switch
              </button>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[12px] font-semibold text-[#797871]">
                People you may like
              </h2>
              <button
                className="text-[10px] text-[#aaa8a1]"
                onClick={() => setToast("Showing a fresh list")}
              >
                See all
              </button>
            </div>
            <div className="space-y-4">
              {people.slice(1, 5).map((person) => (
                <div className="flex items-center gap-2.5" key={person.handle}>
                  <Image
                    src={photo(person.avatar, 96)}
                    width={96}
                    height={96}
                    sizes="40px"
                    alt=""
                    className="size-[35px] rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-semibold">
                      {person.handle}
                    </p>
                    <p className="truncate text-[9px] text-[#aaa8a1]">
                      {person.name} · suggested
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFollowing((current) =>
                        current.includes(person.handle)
                          ? current.filter((item) => item !== person.handle)
                          : [...current, person.handle],
                      );
                      setToast(
                        following.includes(person.handle)
                          ? `Unfollowed ${person.handle}`
                          : `Following ${person.handle}`,
                      );
                    }}
                    className="text-[10px] font-semibold text-[#e9563f]"
                  >
                    {following.includes(person.handle) ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-9 rounded-[18px] bg-[#efeee9] p-4">
              <div className="mb-2 flex items-center gap-1.5 text-[#e9563f]">
                <Sparkles size={13} />
                <span className="text-[9px] font-semibold tracking-[.15em] uppercase">
                  Made for the moments
                </span>
              </div>
              <p className="font-serif text-[17px] leading-tight">
                A quieter kind
                <br />
                of social.
              </p>
              <p className="mt-2 text-[10px] leading-relaxed text-[#89877f]">
                Follow what inspires you. Share what feels like you.
              </p>
            </div>
            <p className="mt-7 text-[9px] leading-6 text-[#b0aea7]">
              About · Guidelines · Privacy · Terms
              <br />© 2026 SOCIA STUDIO
            </p>
          </div>
        </aside>
      </div>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-[#171815]/45 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(92vw,480px)] -translate-x-1/2 -translate-y-1/2 rounded-[24px] bg-[#fbfaf7] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <Dialog.Title className="font-serif text-[25px] tracking-[-.7px]">
                  Share a moment
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-[11px] text-[#9a988f]">
                  A little glimpse into your world.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  aria-label="Close"
                  className="rounded-full p-2 text-[#85837c] hover:bg-[#eeede8]"
                >
                  <X size={17} />
                </button>
              </Dialog.Close>
            </div>
            <div className="mb-4 grid aspect-[2.1/1] place-items-center rounded-[17px] border border-dashed border-[#d7d4ca] bg-[#f1f0eb]">
              <div className="text-center">
                <span className="mx-auto mb-2 grid size-9 place-items-center rounded-full bg-white text-[#e9563f]">
                  <ImagePlus size={17} />
                </span>
                <p className="text-[11px] font-medium">
                  Photo picker connects to S3 uploads
                </p>
                <p className="mt-1 text-[9px] text-[#aaa8a1]">
                  Local media service is not configured
                </p>
              </div>
            </div>
            <form onSubmit={createPost}>
              <textarea
                {...form.register("caption")}
                rows={3}
                placeholder="Write a caption…"
                className="w-full resize-none rounded-[13px] border border-[#e8e6df] bg-white p-3 text-[12px] outline-none focus:border-[#e9a397]"
              />
              <p className="mt-1 min-h-4 text-[10px] text-[#e9563f]">
                {form.formState.errors.caption?.message}
              </p>
              <Button type="submit" variant="accent" className="mt-3 w-full">
                Share moment <Camera size={15} />
              </Button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 grid place-items-center bg-[#171815]/80 p-5"
            onClick={() => setActiveStory(null)}
          >
            <button
              aria-label="Close story"
              className="absolute top-6 right-6 text-white"
            >
              <X />
            </button>
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              className="relative h-[min(78vh,680px)] w-[min(88vw,390px)] overflow-hidden rounded-[25px] bg-[#333]"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={`https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=88`}
                width={900}
                height={1400}
                sizes="390px"
                alt="A moment shared by the community"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/30" />
              <div className="absolute top-4 right-4 left-4 h-0.5 rounded bg-white/40">
                <div className="h-full w-1/3 rounded bg-white" />
              </div>
              <div className="absolute top-8 left-5 flex items-center gap-2 text-white">
                <Image
                  src={photo(
                    people.find((person) => person.handle === activeStory)
                      ?.avatar ?? people[0].avatar,
                    80,
                  )}
                  width={80}
                  height={80}
                  sizes="32px"
                  alt=""
                  className="size-8 rounded-full object-cover"
                />
                <span className="text-[12px] font-semibold">{activeStory}</span>
                <span className="text-[10px] text-white/75">4h</span>
              </div>
              <p className="absolute bottom-8 left-5 font-serif text-[21px] text-white">
                A moment worth keeping.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-[82px] left-1/2 z-[60] -translate-x-1/2 rounded-full bg-[#20211f] px-5 py-3 text-xs text-white shadow-xl md:bottom-7"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
