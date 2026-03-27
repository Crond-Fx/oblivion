import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

function Scripts() {
  return (
    <>
      <script src="https://cdn.jsdelivr.net/npm/medium-zoom@1.1.0/dist/medium-zoom.min.js"></script>
      <script src="../static/js/zoom.js"></script>
    </>
  )
}

export default (() => Scripts) satisfies QuartzComponentConstructor
