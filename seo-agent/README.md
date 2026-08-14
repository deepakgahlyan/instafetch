# InstaFetch SEO Agent

This agent discovers and scores potential editorial backlink opportunities for InstaFetch.

## What it does

- Runs automatically through GitHub Actions.
- Searches Tavily for relevant Instagram/social-media topics.
- Deduplicates opportunities by URL.
- Scores topical relevance, editorial signals, and spam risk.
- Rejects obvious spam/link-farm targets.
- Stores the qualified opportunity list in `seo-agent/data/opportunities.json`.

## What it does not do

It does not automatically post comments, create fake profiles, buy links, publish spam, or send deceptive outreach. Discovery and qualification come first.

## Required GitHub secret

Add a repository Actions secret named:

`TAVILY_API_KEY`

The key is read only at runtime and is never committed to the repository.

## Running it

After the workflow is merged into the repository's default branch, GitHub Actions runs it daily at 06:17 UTC. You can also start it manually from the Actions tab with **Run workflow**.

The opportunity store is committed back to the repository after a successful run so the agent has persistent state without requiring a separate database.
