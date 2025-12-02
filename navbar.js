// Function to load the navbar dynamically
async function loadNavbar(targetId, xmlPath) {
  try {
    // Fetch the XML file
    const res = await fetch(xmlPath);
    if (!res.ok) throw new Error(`Failed to load XML file: ${xmlPath}`);

    const xmlText = await res.text();

    // Parse the XML content
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    // Extract brand and items from the XML
    const brandNode = xml.querySelector("brand");
    const items = xml.querySelectorAll("items > item");

    const brandText = brandNode?.getAttribute("text") || "Site";
    const brandHref = brandNode?.getAttribute("href") || "#";

    // Get the current page path
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    // Build navigation items HTML
    const itemsHtml = Array.from(items).map((item) => {
      const text = item.getAttribute("text") || "";
      const href = item.getAttribute("href") || "#";
      const isActive = href === currentPath ? " active" : "";

      return `
        <li class="nav-item">
          <a class="nav-link${isActive}" aria-current="${isActive ? "page" : ""}" href="${href}">
            ${text}
          </a>
        </li>`;
    }).join("");

    // Build the complete navbar HTML
    const navbarHtml = `
<nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
  <div class="container-fluid">
    <a class="navbar-brand" href="${brandHref}">${brandText}</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        ${itemsHtml}
      </ul>
    </div>
  </div>
</nav>`;

    // Insert the navbar into the target element
    const target = document.getElementById(targetId);
    if (target) {
      target.innerHTML = navbarHtml;
    } else {
      console.warn(`Target element with ID '${targetId}' not found.`);
    }
  } catch (err) {
    console.error("Error loading navbar:", err);
  }
}

// Auto-load the navbar on pages with a #navbar element
document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("navbar");
  if (navContainer) {
    loadNavbar("navbar", "nav.xml");
  }
});
