# Markdown to print kindling

Boilerplate setup for printing Markdown content to paged media (e.g. PDF).

**TODO: This is a work in progress.**


## Design notes

Goal: a single, configurable command with sensible defaults to print from one or more Markdown files to paged media.

Constraints:

- Rely on existing tools
- Make swapping those tools easy – corollary: stick to standards

Two steps from Markdown to paged media:

1. Process base Markdown content to generate standard HTML & CSS
2. Process generated HTML & CSS to generate paged media output


## Licence

MIT
