document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("admin-wrapper");
  const esMovil = () => window.matchMedia("(max-width: 991.98px)").matches;

  document.querySelectorAll("[data-sidebar-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      wrapper.classList.toggle(
        esMovil() ? "sidebar-open" : "sidebar-collapsed",
      );
    });
  });

  document
    .querySelector(".sidebar-backdrop")
    ?.addEventListener("click", () => wrapper.classList.remove("sidebar-open"));
});