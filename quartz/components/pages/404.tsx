import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  // Вычисляем базовую директорию для ссылки на главную страницу
  // Если сайт на домене, вернет "/", если на GitHub Pages без домена — "/repo/"
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint">
      <h1>404</h1>
      <p>Вы заблудились в Обливионе. Этой страницы не существует, или она была поглощена Эфиром.</p>
      <p>
        <a href={baseDir}>Вернуться на главную</a>
      </p>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor