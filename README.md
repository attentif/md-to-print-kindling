# Markdown to print kindling

Boilerplate setup for printing Markdown content to paged media (e.g. PDF).

[![Stories in Ready](https://badge.waffle.io/attentif/md-to-print-kindling.svg?label=ready&title=Ready)](http://waffle.io/attentif/md-to-print-kindling)

**TODO: This is a work in progress.**


## Design notes

Goal: a single, configurable command with sensible defaults to print from one or more Markdown files to paged media.

Constraints:

- Rely on existing tools
- Make swapping those tools easy – corollary: stick to standards

Two steps from Markdown to paged media:

1. Process base Markdown content to generate standard HTML & CSS
2. Process generated HTML & CSS to generate paged media output


## Usage

(Prerequisite: Node.js)

Download zip (or clone), then the basic workflow is (from the repo root):

1. edit contents in `src`
2. run `make` to build once , or `make watch` to watch and auto-rebuild on `src` changes

To cleanup `build`, do `make clean` (leaves untouched the folder itself and possible system files within).


## Licence

MIT
