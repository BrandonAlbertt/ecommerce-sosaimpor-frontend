<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:sosaimpor-agent-rules -->
# SOSA IMPORT project rules

Before making code changes, read `AGENT_CONTEXT.md` for the project structure,
main flows, and architecture rules.

Keep the current architecture simple and easy to follow:

- Main logic belongs in the parent/container, especially from Home
  (`ProductPageContainer`) and product detail (`ProductDetailContainer`).
- Children should work through props and callbacks.
- Do not add Context API, extra Providers, Redux, Zustand, or hidden global
  state. Keep only the existing dark/light theme provider.
- Prefer local hooks for API/data/effects and keep changes scoped.
- Do not modify working code unless the request requires it.
<!-- END:sosaimpor-agent-rules -->
