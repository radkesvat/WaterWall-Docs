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


