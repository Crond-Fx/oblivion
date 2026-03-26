// Функция инициализации
function initZoom() {
  if (typeof mediumZoom === 'function') {
    mediumZoom(".page img", {
      background: "rgba(0, 0, 0, 0.8)",
      margin: 40,
    });
  }
}

// Запуск при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initZoom);
} else {
  // Если документ уже загружен (на всякий случай)
  initZoom();
}
