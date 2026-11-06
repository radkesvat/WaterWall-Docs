# WaterWall Documentation

docs are kept in this repo, read them online there:

https://radkesvat.github.io/WaterWall-Docs/docs/intro

The optional documentation assistant uses the separate private
[waterwall-docs-assistant](https://github.com/radkesvat/waterwall-docs-assistant)
repository, hosted on Vercel with Upstash. Only the browser integration belongs in
this repository. A local backend checkout may live in `assistant/`; that entire
directory is gitignored and is not a submodule.

Set the public `DOCS_ASSISTANT_API_URL` when starting or building the site, for
example `https://your-backend.vercel.app/api/chat`. For GitHub Pages, set the
repository variable with that name before deploying. An empty value hides the
chat UI. Backend credentials belong in the private backend's environment, never
in this site's configuration. Backend setup and indexing instructions live in
the private repository's README.

The assistant docks beside the documentation on desktop and opens as a full-screen
dialog on smaller screens. Readers can select a passage while the desktop panel
is open, draft multiline JSON, and copy suggested code or complete answers.
Enter inserts a newline; Ctrl/Command + Enter sends a message. Conversations stay
in memory while navigating the site and reset on reload or **New conversation**.
**Standard** is the default response mode for most questions; **Deep** is for
more involved problems and may take longer. Changing modes preserves the draft,
conversation, and selected passage. A retry retains its original mode, and
**New conversation** resets the mode to Standard.
Messages are limited to 4,000 characters, with recent turns included within the
backend's 20,000-character context budget. The waiting indicator shows elapsed
time; it does not represent streamed reasoning or individual tool activity.

The private backend checks successful GitHub Pages deployments hourly and updates
the assistant index when documentation changes. Normal docs updates need no local
indexing commands. To check sooner, run **Sync deployed documentation** from the
private backend repository's Actions tab. Its credentials and indexing workflow
remain in that repository.


