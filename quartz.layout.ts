import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { Options } from "./quartz/components/Explorer"

export const mapFn: Options["mapFn"] = (node) => {
  return node
}

export const filterFn: Options["filterFn"] = (node) => {
  if (node.slugSegment === "tags") {
    return false
  }

  if (node.data?.frontmatter?.unlisted === true) {
    return false
  }

  return true
}

export const sortFn: Options["sortFn"] = (a, b) => {
  const rawA = a.isFolder ? a.data?.frontmatter?.folderOrder : a.data?.frontmatter?.noteOrder
  const rawB = b.isFolder ? b.data?.frontmatter?.folderOrder : b.data?.frontmatter?.noteOrder
 
  const parseOrder = (val: any): number | undefined => {
    if (val === undefined || val === null) return undefined
    const str = String(val).trim()
    if (str === "" || str.toLowerCase() === "null" || str.toLowerCase() === "undefined") {
      return undefined
    }
    const num = Number(str)
    return isNaN(num) ? undefined : num
  }

  const orderA = parseOrder(rawA)
  const orderB = parseOrder(rawB)

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
  if (!a.isFolder && b.isFolder) {
    return 1
  } else {
    return -1
  }
}

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Scripts(),
  ],
  footer: Component.Footer(),
}

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
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({
      rootName: "Обливион",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta()
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
      order: ["filter", "sort", "map"],
      mapFn,
      filterFn,
      sortFn,
    }),
  ],
  right: [],
}