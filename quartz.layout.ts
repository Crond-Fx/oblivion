import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// mod: define Explorer functions
import { Options } from "./quartz/components/Explorer"

export const mapFn: Options["mapFn"] = (node) => {
  return node
}
export const filterFn: Options["filterFn"] = (node) => {
  const isUnlisted = node.data?.frontmatter?.unlisted === true
  return node.slugSegment !== "tags" && !isUnlisted
}
export const sortFn: Options["sortFn"] = (a, b) => {
  const orderA = a.isFolder
    ? a.data?.frontmatter?.folderOrder as number | undefined
    : a.data?.frontmatter?.noteOrder as number | undefined
  const orderB = b.isFolder
    ? b.data?.frontmatter?.folderOrder as number | undefined
    : b.data?.frontmatter?.noteOrder as number | undefined

  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    if (orderA !== undefined && orderB !== undefined) {
      return orderA - orderB;
    } else if (orderA !== undefined) {
      return -1;
    } else if (orderB !== undefined) {
      return 1;
    } else {
      return a.displayName.localeCompare(b.displayName);
    }
  }
  // keep folders in front
  if (!a.isFolder && b.isFolder) {
    return 1
  } else {
    return -1
  }
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Scripts(),
  ],
  footer: Component.Footer(),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({
        rootName: "Обливион",
      }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta({
      showReadingTime: false,
    }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "Содержание",
      folderClickBehavior: "link",
      folderDefaultState: "open",
      order: ["filter", "sort", "map"],
      mapFn,
      filterFn,
      sortFn,
    }),
  ],
  right: [
    // Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}


// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({
      rootName: "Обливион",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      order: ["filter", "sort", "map"],
      mapFn,
      filterFn,
      sortFn,
    }),
  ],
  right: [],
}