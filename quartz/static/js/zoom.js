// Функция инициализации
function initZoom() {
  // Проверяем наличие библиотеки
  if (typeof mediumZoom === 'function') {
    // Применяем зум к картинкам внутри .page
    mediumZoom(".page img", {
      background: "rgba(0, 0, 0, 0.8)",
      margin: 16,
    });
  }
}

// 1. Запуск при первой загрузке страницы (для обоих режимов)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initZoom);
} else {
  initZoom();
}

// 2. Запуск после каждой навигации в режиме SPA
// Это ключевое событие Quartz для перезапуска JS-логики
document.addEventListener("nav", () => {
  initZoom();
});