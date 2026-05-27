import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug } from "../../util/path"
import { sharedPageComponents } from "../../../quartz.layout"
import { NotFound } from "../../components"
import { defaultProcessedContent } from "../vfile"
import { write } from "./helpers"
import { i18n } from "../../i18n"

// Импортируем остальные компоненты Quartz для сайдбара
import * as Component from "../../components"

export const NotFoundPage: QuartzEmitterPlugin = () => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    pageBody: NotFound(),
    beforeBody: [],
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
      }),
    ],
    right: [],
  }
  const { head: Head, pageBody, footer: Footer } = opts
  const Body = BodyConstructor()
  return {
    name: "404Page",
    getQuartzComponents() {
      // КРИТИЧЕСКИ ВАЖНО: возвращаем все компоненты из opts.left, 
      // чтобы Quartz подключил их JS-скрипты (поисковый индекс, логику темной темы и т.д.)
      return [Head, Body, pageBody, Footer, ...opts.left, ...opts.right]
    },
    async *emit(ctx, _content, resources) {
      const cfg = ctx.cfg.configuration
      const slug = "404" as FullSlug
      const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
      const path = url.pathname as FullSlug
      const notFound = i18n(cfg.locale).pages.error.title
      const [tree, vfile] = defaultProcessedContent({
        slug,
        text: notFound,
        description: notFound,
        frontmatter: { title: notFound, tags: [] },
      })
      const externalResources = pageResources(path, resources)
      const componentData: QuartzComponentProps = {
        ctx,
        fileData: vfile.data,
        externalResources,
        cfg,
        children: [],
        tree,
        allFiles: [],
      }
      yield write({
        ctx,
        content: renderPage(cfg, slug, componentData, opts, externalResources),
        slug,
        ext: ".html",
      })
    },
    async *partialEmit() {},
  }
}