import remarkGfm from "remark-gfm"
import smartypants from "remark-smartypants"
import { QuartzTransformerPlugin } from "../types"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

export interface Options {
  enableSmartyPants: boolean
  linkHeadings: boolean
}

const defaultOptions: Options = {
  enableSmartyPants: true,
  linkHeadings: true,
}

function rehypeExternalLinks() {
  const walk = (node: any) => {
    if (node.type === "element" && node.tagName === "a") {
      const href = node.properties?.href

      const isExternal = 
        typeof href === "string" && 
        (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) &&
        !href.includes("crond-fx.github.io")

      if (isExternal) {
        if (!node.properties) node.properties = {}
        node.properties.target = "_blank"
        node.properties.rel = "noopener noreferrer"
      }
    }
    if (node.children) {
      node.children.forEach(walk)
    }
  }

  return (tree: any) => {
    walk(tree)
  }
}

export const GitHubFlavoredMarkdown: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "GitHubFlavoredMarkdown",
    markdownPlugins() {
      return opts.enableSmartyPants ? [remarkGfm, smartypants] : [remarkGfm]
    },
    htmlPlugins() {
      if (opts.linkHeadings) {
        return [
          rehypeSlug,
          rehypeExternalLinks,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["heading-link"],
                "data-no-popover": true,
              },
            },
          ],
        ]
      } else {
        return []
      }
    },
  }
}

