import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// mod: define Explorer functions
import { Options } from "./quartz/components/Explorer"
 
export const mapFn: Options["mapFn"] = (node) => {
  return node
}
export const filterFn: Options["filterFn"] = (node) => {
  return node.slugSegment !== "tags"
}
export const sortFn: Options["sortFn"] = (a, b) => {
  const rawA = a.isFolder ? a.data?.frontmatter?.folderOrder : a.data?.frontmatter?.noteOrder
  const rawB = b.isFolder ? b.data?.frontmatter?.folderOrder : b.data?.frontmatter?.noteOrder
 
  const orderA = rawA !== undefined && rawA !== null ? Number(rawA) : undefined
  const orderB = rawB !== undefined && rawB !== null ? Number(rawB) : undefined

  // ================= ДИАГНОСТИЧЕСКОЕ ЛОГИРОВАНИЕ =================
  // Нам интересно посмотреть, что происходит при сравнении нашей статьи «Энергоресурсы»
  const isTargetA = a.displayName.includes("Энергоресурсы")
  const isTargetB = b.displayName.includes("Энергоресурсы")

  if (isTargetA || isTargetB) {
    console.log(`\n=== [DEBUG SORT] Сравнение в проводнике ===`)
    console.log(`  Файл A: "${a.displayName}" (isFolder: ${a.isFolder})`)
    console.log(`    a.data существует? ${!!a.data}`)
    console.log(`    a.data.frontmatter:`, a.data?.frontmatter)
    console.log(`    Извлечено rawA: ${rawA} (тип: ${typeof rawA}) -> orderA: ${orderA}`)
    
    console.log(`  Файл B: "${b.displayName}" (isFolder: ${b.isFolder})`)
    console.log(`    b.data существует? ${!!b.data}`)
    console.log(`    b.data.frontmatter:`, b.data?.frontmatter)
    console.log(`    Извлечено rawB: ${rawB} (тип: ${typeof rawB}) -> orderB: ${orderB}`)
    console.log(`==========================================\n`)
  }
  // ===============================================================

  // Обычная логика сравнения
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

// Объединяем настройки Explorer в один объект, чтобы не дублировать код
const explorerConfig: Options = {
  title: "Содержание",
  folderClickBehavior: "link",
  folderDefaultState: "open",
  useSavedState: false, // Временно отключаем кэш для проверки сортировки
  order: ["filter", "sort", "map"],
  mapFn,
  filterFn,
  sortFn,
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
    Component.Explorer(explorerConfig), // Применяем общую конфигурацию
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
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
    Component.Explorer(explorerConfig), // Теперь сортировка применится и здесь!
  ],
  right: [],
}