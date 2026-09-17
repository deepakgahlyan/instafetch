import Link from "next/link";

type ResourceKind = "home" | "general" | "video" | "reels" | "photo";

type Section = {
  title: string;
  paragraphs: string[];
};

type ResourceData = {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  sections: Section[];
  cards: Array<{ title: string; text: string }>;
  checklistTitle: string;
  checklist: string[];
  calloutTitle: string;
  calloutText: string;
  secondaryImage?: string;
  secondaryImageAlt?: string;
};

const resources: Record<ResourceKind, ResourceData> = {
  home: {
    eyebrow: "InstaFetch Resource Center",
    title: "A practical guide to saving public Instagram media",
    intro:
      "A downloader is only useful when the page around it answers the questions people have before, during, and after a download. This guide explains the workflow, media quality, browser behavior, common limitations, and responsible reuse in plain language.",
    image: "/illustrations/instafetch-workflow.svg",
    imageAlt: "Illustration showing the four-step InstaFetch public media workflow",
    imageCaption: "The InstaFetch workflow: copy a public URL, submit it, review the available media, then choose a download.",
    sections: [
      {
        title: "What happens after you paste a link?",
        paragraphs: [
          "InstaFetch starts with the URL you provide. The service checks that the address is an Instagram post, Reel, or supported video/photo URL and then looks for media that is publicly accessible through the page. The important distinction is that the downloader is checking availability; it is not unlocking a private account or bypassing an access control.",
          "When a public page exposes downloadable media, the result can contain a video, an image, or several items from a carousel. A carousel is treated as a set of media rather than forcing the user to repeat the request for every item. That makes the result easier to inspect before anything is saved.",
          "The browser then receives the media information needed to choose a file. Keeping this step visible helps users understand what was actually found instead of presenting a generic button with no context."
        ],
      },
      {
        title: "How to get a clean Instagram source URL",
        paragraphs: [
          "The most dependable starting point is the original share link for the post or Reel. Copy it from Instagram's share controls instead of copying text from a browser search result, a shortened message, or a page that has been wrapped by another service.",
          "A clean URL also makes troubleshooting easier. If a result fails, you can compare the submitted address with the address shown on Instagram and remove accidental spaces or extra tracking parameters. InstaFetch normalizes supported URLs before processing them.",
          "For a carousel, use the URL of the carousel itself. The service can then inspect the group of media items together and return the available images or videos as one result set."
        ],
      },
      {
        title: "Why a public URL can still fail",
        paragraphs: [
          "Public visibility is a useful starting condition, not a guarantee that a file will always be available to a third-party downloader. A post can be deleted, changed to private, restricted by the platform, unavailable in the current delivery path, or served in a format the current resolver cannot process.",
          "Availability can also change over time because the underlying media delivery system changes. A URL that worked last week may expose a different set of resources today. Good user-facing copy should acknowledge that limitation instead of promising that every Instagram link will work forever.",
          "When a result is missing, the practical next step is to confirm that the content is still public, copy the original link again, and retry once. If the post remains inaccessible, there may simply be no public downloadable media available through the current delivery path."
        ],
      },
      {
        title: "Choosing the right media before saving",
        paragraphs: [
          "For a single video or photo, the choice is usually straightforward. Carousels are different because a single URL can represent several media items, and some items may be videos while others are photos. Reviewing the returned list lets you choose exactly what you need.",
          "For video, the largest available rendition is not automatically the best choice for every person. A higher-resolution file can be useful for editing or archiving, while a smaller file may be faster to move to a phone or share with another device.",
          "For photos, dimensions matter alongside visual quality. A very large image may be useful for cropping, while a smaller version may be enough for a screen background or quick reference."
        ],
      },
    ],
    cards: [
      { title: "Public source", text: "Start with a post or Reel that is publicly viewable in a normal browser session." },
      { title: "Clear result", text: "Review the media items returned before choosing a file to save." },
      { title: "Right format", text: "Think about resolution, file size, device storage, and intended use." },
    ],
    checklistTitle: "A better download checklist",
    checklist: [
      "Use the original Instagram share URL.",
      "Confirm that the post is publicly viewable.",
      "Review every item returned for a carousel.",
      "Choose the file size that fits your actual use.",
      "Save important files to a device or storage location you control.",
      "Keep creator rights and privacy in mind before republishing media."
    ],
    calloutTitle: "The service is a tool, not a rights grant",
    calloutText:
      "Being able to download a public file does not automatically give you permission to repost, sell, edit, or commercially distribute someone else's work. Copyright, privacy, publicity rights, and platform rules can still apply to what you do with the file.",
    secondaryImage: "/illustrations/responsible-downloads.svg",
    secondaryImageAlt: "Illustration explaining public access, rights, and privacy when downloading media",
  },
  general: {
    eyebrow: "Instagram Downloader Guide",
    title: "Understanding the different kinds of Instagram downloads",
    intro:
      "Instagram links can point to a single photo, a video, a Reel, or a carousel containing several pieces of media. This guide explains what changes between those formats and how to use a downloader without confusing access with ownership.",
    image: "/illustrations/instafetch-workflow.svg",
    imageAlt: "Four-step illustration for using InstaFetch with public Instagram content",
    imageCaption: "A good download workflow keeps the source, media list, and final file choice visible to the user.",
    sections: [
      {
        title: "One link does not always mean one file",
        paragraphs: [
          "A common assumption is that an Instagram URL maps directly to one downloadable object. In practice, a post can contain multiple media items. A carousel may combine photographs and videos, so the downloader needs to return a collection rather than treating the first item as the entire post.",
          "That distinction matters for users who want to save a complete set. Seeing all available items in one place reduces the chance of missing the second, third, or later part of a carousel. It also gives the user a chance to decide which files are relevant instead of downloading everything automatically.",
          "For a simple single-media post, the interface should feel lighter. For a multi-item post, the interface should expand naturally to show the collection without making the user repeat the same URL."
        ],
      },
      {
        title: "The source URL is part of the result",
        paragraphs: [
          "A professional downloader should preserve the relationship between the resulting file and the page it came from. That is why InstaFetch keeps the source URL associated with the returned media information. It gives users a useful reference if they need to revisit the original post later.",
          "Keeping the source visible is also helpful when a file needs to be credited, discussed with a teammate, or checked against the creator's original version. The URL is not a replacement for permission, but it is valuable context.",
          "For troubleshooting, the source URL also makes errors easier to understand. If the original post has disappeared or changed access settings, the reason for a failed result is more apparent."
        ],
      },
      {
        title: "What the downloader can and cannot promise",
        paragraphs: [
          "InstaFetch is designed for supported public Instagram content. It does not require an Instagram password and it does not present itself as a way to enter private accounts. The service only returns media that its current resolver can access and process.",
          "That means a user should treat the availability notice as a real-time result rather than a permanent guarantee. Platform changes, post changes, expired media URLs, and unsupported content types can all affect what is returned.",
          "This transparency is important for a high-quality utility site. Clear limitations are more useful than marketing copy that promises universal access and leaves users confused when a particular URL does not work."
        ],
      },
      {
        title: "Using downloads as part of a larger workflow",
        paragraphs: [
          "Many people do not download a file just to store it. They may be collecting references for a project, keeping a backup of their own public post, preparing a video edit, saving an image for offline viewing, or organizing examples for research or design work.",
          "For those workflows, file naming and organization become more important than the download button itself. A useful habit is to keep related media in a dated folder, preserve the original source URL in your notes, and avoid creating several ambiguous copies of the same file.",
          "When a download is part of a professional project, keep a record of where the media came from and what permission or license applies. That small step can save time later when the same asset needs to be reviewed or removed."
        ],
      },
    ],
    cards: [
      { title: "Post", text: "A single public post can expose one image, one video, or a group of media items." },
      { title: "Reel", text: "A Reel is treated as video content and is resolved through a dedicated public-media path." },
      { title: "Carousel", text: "A carousel can return several items, allowing the user to review the set before saving." },
    ],
    checklistTitle: "Before you press download",
    checklist: [
      "Check that you are using the original public Instagram URL.",
      "Make sure the content is still visible to you in a browser.",
      "For carousels, confirm how many media items were returned.",
      "Decide whether you need every item or only selected files.",
      "Keep the original source URL with files you intend to use later.",
      "Check whether your intended use requires permission or attribution."
    ],
    calloutTitle: "Clarity is part of the product",
    calloutText:
      "A high-standard downloader should tell users what it supports, show what it found, and explain why a result might not be available. Those details are part of the product experience, not filler around the tool.",
    secondaryImage: "/illustrations/instagram-quality-guide.svg",
    secondaryImageAlt: "Illustration showing the factors that influence Instagram media quality",
  },
  video: {
    eyebrow: "Instagram Video Guide",
    title: "How to think about Instagram video quality, sound, and file size",
    intro:
      "Video downloads are not just a question of resolution. Duration, audio, aspect ratio, device storage, browser behavior, and the version exposed by the source all affect the file you end up using.",
    image: "/illustrations/instagram-quality-guide.svg",
    imageAlt: "Illustration explaining the factors that influence Instagram video quality",
    imageCaption: "Video quality depends on the source upload, the version exposed by the platform, and how the resulting file fits the user's device and workflow.",
    sections: [
      {
        title: "Resolution is only one part of video quality",
        paragraphs: [
          "A larger pixel count can look sharper, but resolution does not tell the whole story. Compression, bitrate, motion, lighting, and the original upload all affect what viewers actually see. A video that was heavily compressed during upload will not become cleaner simply because a larger file is requested later.",
          "InstaFetch therefore treats the available rendition as the source of truth. When multiple versions are exposed, the resolver looks at the available dimensions and bandwidth information rather than pretending that every video has one universal quality level.",
          "For ordinary viewing, the most useful file is often the one that balances clarity with size. For editing or archiving, a larger rendition can be more practical, especially when the video contains fine text or fast movement."
        ],
      },
      {
        title: "Why vertical videos look different on different devices",
        paragraphs: [
          "Most short-form Instagram videos are designed around a tall mobile screen. On a desktop monitor, that same video may appear with empty space on either side. That is not necessarily a problem with the download; it is a consequence of the original aspect ratio.",
          "Cropping a vertical video to fill a wide frame removes part of the original composition. A better approach for editing is often to keep the original file intact and place it inside the target layout with an appropriate background or framing treatment.",
          "Keeping the source file unchanged also helps when the same clip needs to be reused in more than one context. A master copy can be adapted later instead of repeatedly cropping and recompressing the only available version."
        ],
      },
      {
        title: "Audio can be just as important as the picture",
        paragraphs: [
          "For talking-head clips, tutorials, interviews, and music-driven edits, audio quality often determines whether a downloaded video is actually useful. A visually sharp file with damaged or missing sound can be less valuable than a slightly smaller file with intact audio.",
          "When a returned result includes a video URL, the browser receives the media version exposed by the resolver. InstaFetch does not reconstruct a soundtrack from a separate source or ask users to provide account credentials to unlock audio.",
          "After downloading an important video, it is worth opening the file once on the target device. A quick playback check catches issues with sound, aspect ratio, or compatibility before the file is moved into a larger project."
        ],
      },
      {
        title: "A practical way to choose a video file",
        paragraphs: [
          "Start with the purpose. A clip that is only being watched offline does not have the same requirements as a file being imported into an editor. For temporary viewing, smaller files can save storage and transfer time. For editing, keeping the highest useful rendition can reduce quality loss later.",
          "Next, consider where the file will live. Phones and tablets have limited local storage, while desktop or cloud workflows can tolerate larger media. If you are collecting many clips, total storage can become more important than the difference between two individual resolutions.",
          "Finally, keep the original source link with material that has ongoing project value. That gives you a reference point if you later need to confirm the original post, creator, context, or permission."
        ],
      },
    ],
    cards: [
      { title: "Watch", text: "Choose a file that plays smoothly on the device where you will watch it." },
      { title: "Edit", text: "Keep the highest useful rendition when you expect to crop, color-grade, or cut the clip." },
      { title: "Archive", text: "Balance quality against storage, and keep the original source reference beside the file." },
    ],
    checklistTitle: "Video download checklist",
    checklist: [
      "Confirm the Reel or video is publicly accessible.",
      "Check that the returned result is actually a video file.",
      "Consider resolution and file size together.",
      "Play the saved file once before using it in a larger project.",
      "Keep the original URL for reference and attribution research.",
      "Use downloaded material only in ways you are authorized to use."
    ],
    calloutTitle: "Do not confuse a bigger file with a better source",
    calloutText:
      "A downloader cannot recreate details that were never present in the original upload. When evaluating video quality, focus on the source rendition that is actually available rather than assuming that a larger download is always a cleaner one.",
  },
  reels: {
    eyebrow: "Instagram Reels Guide",
    title: "A closer look at downloading Instagram Reels",
    intro:
      "Reels are built for quick, vertical viewing, but the reasons people save them vary. Some want an offline copy of their own public work, others are collecting references, and some are preparing clips for a project where the original source must remain easy to identify.",
    image: "/illustrations/instafetch-workflow.svg",
    imageAlt: "Illustration of the InstaFetch workflow for public Instagram Reels",
    imageCaption: "For a Reel, the useful workflow is simple: copy the original link, submit it, verify the video result, and then save the file.",
    sections: [
      {
        title: "Start with the original Reel URL",
        paragraphs: [
          "A Reel URL copied directly from Instagram is the best reference for the media you want. Using the original share link avoids confusion between the creator's page and unrelated search or repost pages.",
          "When the link is submitted, InstaFetch checks whether the URL matches a supported Reel-style path and whether public video media can be resolved. A valid-looking link can still fail if the Reel is no longer public or if the current media delivery system does not expose a downloadable version.",
          "Keeping the original URL also helps later. If you use the file in notes, a presentation, or a creative workflow, the source remains one click away for checking context."
        ],
      },
      {
        title: "Why Reels are usually portrait-first",
        paragraphs: [
          "Reels are designed around vertical phone screens, so the source video often uses a tall aspect ratio. On a laptop or desktop, it may appear narrow even when the file is high quality. That behavior is expected and does not mean the video was damaged during download.",
          "For editors, the original portrait file is usually the best starting point. Creating a separate widescreen crop too early can remove subtitles, faces, product details, or other important parts of the composition.",
          "A practical workflow is to keep the original Reel as the master file and create edited variants only when a specific platform or project calls for them."
        ],
      },
      {
        title: "Audio, subtitles, and context matter",
        paragraphs: [
          "Reels can rely heavily on speech, music, subtitles, or on-screen text. A saved video should therefore be checked as a complete piece rather than judged only from the thumbnail. A file that looks correct in a preview can still behave differently when played on another device.",
          "If a Reel is being used as a reference, record the context at the same time: the creator, the source URL, the date you accessed it, and what you intend to use it for. This is especially helpful when a project contains many similar clips.",
          "If the content includes someone else's voice, likeness, music, or original editing, remember that downloading the file does not remove the rights attached to those elements."
        ],
      },
      {
        title: "When a Reel does not resolve",
        paragraphs: [
          "The first check is simple: open the Reel in a normal browser and verify that it is still publicly viewable. If it no longer loads, the downloader cannot reliably obtain a public copy from the same URL.",
          "If the Reel is visible but the downloader returns no media, the cause may be a change in the platform's public delivery path or an unsupported version of the content. Trying the original link again can help, especially after a recent change to the post.",
          "The important part is to treat a failed resolution as an availability result rather than a promise that can be bypassed with account credentials."
        ],
      },
    ],
    cards: [
      { title: "Portrait-first", text: "Expect a tall video canvas on desktop because Reels are designed for mobile viewing." },
      { title: "Context-aware", text: "Keep the creator and source URL with saved reference clips." },
      { title: "Project-ready", text: "Keep the original file intact before making crops or edits for another format." },
    ],
    checklistTitle: "Reel checklist",
    checklist: [
      "Copy the Reel URL from the original Instagram post.",
      "Confirm the Reel still opens publicly in your browser.",
      "Check the returned file's picture and audio before editing.",
      "Keep portrait footage in its original aspect ratio until you need a crop.",
      "Record the source when the clip matters to a project.",
      "Review copyright and permission before publishing the saved Reel elsewhere."
    ],
    calloutTitle: "A saved Reel should still have a source",
    calloutText:
      "The most useful archive is not just a video file. Keep enough context to understand where the clip came from, who created it, and why you saved it.",
    secondaryImage: "/illustrations/responsible-downloads.svg",
    secondaryImageAlt: "Illustration about responsible use of downloaded public media",
  },
  photo: {
    eyebrow: "Instagram Photo Guide",
    title: "What to know about Instagram photo downloads and carousels",
    intro:
      "Photos are easier to overlook than video, but image dimensions, compression, carousel structure, and intended use all affect which file is useful. This guide focuses on practical image quality rather than promising a single universal resolution.",
    image: "/illustrations/instagram-quality-guide.svg",
    imageAlt: "Illustration explaining Instagram image quality and availability",
    imageCaption: "A useful photo result considers the original image, the available candidate size, and how the file will be used after download.",
    sections: [
      {
        title: "Image size is not the same as visual quality",
        paragraphs: [
          "A photo with more pixels can preserve more detail, but pixel dimensions are only one part of the story. Compression, sharpening, the original camera image, and the way the picture was uploaded can all influence the final appearance.",
          "InstaFetch selects among image candidates exposed by the public source when more than one is available. That gives the downloader a practical way to return a useful rendition without claiming that it can restore the original camera file.",
          "For most screen-based uses, a strong available candidate is enough. For print or heavy editing, the original file from the creator is usually a better source than any social-platform rendition."
        ],
      },
      {
        title: "Understanding Instagram carousels",
        paragraphs: [
          "A carousel can contain several images, several videos, or a mix of both. Treating it as a single photo can hide useful content. A professional result should represent the carousel as multiple media items so the user can review the set.",
          "This is especially helpful when the first image is only a cover. Later slides may contain charts, product details, screenshots, event information, or additional photographs that are just as important to the user.",
          "When saving a carousel for reference, consider keeping the original order. The sequence can carry meaning, especially for step-by-step posts, before-and-after comparisons, or visual stories."
        ],
      },
      {
        title: "Different photo uses need different files",
        paragraphs: [
          "A background image, a social-media reference, and an editing asset do not require exactly the same file. For a phone wallpaper, dimensions and composition may matter more than maximum detail. For design work, the ability to crop cleanly may be more important.",
          "It is also worth considering file organization. A descriptive filename can help when a project includes dozens of images, while a small note containing the source URL can preserve the context that a filename cannot.",
          "Avoid repeatedly downloading and recompressing the same image. Keep one clean copy, then create working versions from that copy when you need a different size or crop."
        ],
      },
      {
        title: "Why an image may not be available",
        paragraphs: [
          "A photo can stop being downloadable when the post is removed, made private, restricted, or delivered through a path the resolver cannot currently process. A visible page can also expose a different image candidate set than before.",
          "The best response is to confirm the page is still public and retry with the original URL. If no public image candidate is exposed, the downloader should report that rather than pretending it can recover a private or inaccessible copy.",
          "That behavior keeps the tool predictable and helps users distinguish a normal availability limitation from a problem with their browser or device."
        ],
      },
    ],
    cards: [
      { title: "Screen use", text: "Choose a practical size for the device or layout where the image will appear." },
      { title: "Editing", text: "Keep the largest useful candidate when you expect to crop or resize the image." },
      { title: "Carousel", text: "Review the whole sequence so later slides are not missed or saved out of order." },
    ],
    checklistTitle: "Photo download checklist",
    checklist: [
      "Open the public post and copy the original URL.",
      "Check whether the post is a single photo or a carousel.",
      "Review the number of media items returned.",
      "Choose a useful image size for the actual destination.",
      "Keep the source URL with images that matter to a project.",
      "Confirm that you have the right to reuse the image before publishing it elsewhere."
    ],
    calloutTitle: "Social-platform images are usually working copies",
    calloutText:
      "When image quality is critical for publication or print, the original creator-provided file is usually the appropriate source. A social-platform download is best treated as an accessible rendition, not a guaranteed replacement for the original.",
    secondaryImage: "/illustrations/responsible-downloads.svg",
    secondaryImageAlt: "Illustration about responsible downloading and reuse of public images",
  },
};

export default function HighValueResource({ kind }: { kind: ResourceKind }) {
  const data = resources[kind];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby={`${kind}-resource-title`}>
      <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/55 p-6 shadow-2xl md:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">{data.eyebrow}</p>
            <h2 id={`${kind}-resource-title`} className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl">{data.title}</h2>
            <p className="mt-6 text-lg leading-8 text-zinc-300">{data.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-zinc-300">
              <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-4 py-2">Public content focus</span>
              <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-4 py-2">Browser-first workflow</span>
              <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-4 py-2">Practical guidance</span>
            </div>
          </div>
          <figure className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80">
            <img src={data.image} alt={data.imageAlt} width={1200} height={720} className="h-auto w-full" loading="lazy" />
            <figcaption className="border-t border-zinc-800 px-5 py-4 text-sm leading-6 text-zinc-500">{data.imageCaption}</figcaption>
          </figure>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {data.cards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{card.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-10">
            {data.sections.map((section) => (
              <article key={section.title}>
                <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-base leading-8 text-zinc-300">{paragraph}</p>
                ))}
              </article>
            ))}
          </div>

          <aside className="self-start rounded-3xl border border-violet-500/20 bg-violet-500/5 p-7 lg:sticky lg:top-24">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Practical checklist</p>
            <h3 className="mt-3 text-2xl font-bold text-white">{data.checklistTitle}</h3>
            <ul className="mt-6 space-y-4">
              {data.checklist.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-7 text-zinc-300">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-bold text-violet-300">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {data.secondaryImage && (
          <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <figure className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80">
              <img src={data.secondaryImage} alt={data.secondaryImageAlt ?? "InstaFetch responsible-use illustration"} width={1200} height={650} className="h-auto w-full" loading="lazy" />
            </figure>
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Good practice</p>
              <h3 className="mt-3 text-3xl font-bold text-white">{data.calloutTitle}</h3>
              <p className="mt-5 text-base leading-8 text-zinc-300">{data.calloutText}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/about" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-500">About InstaFetch</Link>
                <Link href="/blog" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-500">Read the guides</Link>
              </div>
            </div>
          </div>
        )}

        {!data.secondaryImage && (
          <div className="mt-14 rounded-3xl border border-violet-500/20 bg-violet-500/5 p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Good practice</p>
            <h3 className="mt-3 text-3xl font-bold text-white">{data.calloutTitle}</h3>
            <p className="mt-5 max-w-4xl text-base leading-8 text-zinc-300">{data.calloutText}</p>
          </div>
        )}
      </div>
    </section>
  );
}
