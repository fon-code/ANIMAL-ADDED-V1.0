# AI Coding Instructions for WMS Master

## 1. Design System & Component Policy
- **Global CSS Utility:** ALWAYS use the `.sys-*` classes defined in `src/index.css` for typography, layout, and common UI (e.g., use `className="sys-title-main"` instead of raw Tailwind classes like `text-3xl font-black`). This ensures a centralized design system.
- **ALWAYS** check `src/components/shared/` before creating a new UI element.
- **PROACTIVE EXTRACTION:** If you find yourself writing a UI pattern or logic that is likely to be reused (e.g., a specific status badge, a custom filter bar, or a specialized data formatter), you **MUST** extract it to `src/components/shared/` immediately, even if not explicitly asked.
- **MANDATORY SHARED COMPONENTS:**
  - **Tables:** Use `DataTable` for all lists (includes built-in Sort, Filter, and Date search).
  - **Pagination:** Use `Pagination` for large datasets.
  - **Scanning:** Use `Scanner` for QR/Barcode reading.
  - **Codes:** Use `CodeGenerator` for creating QR/Barcodes.
  - **Files:** Use `FileAttachment` for image/document uploads.
  - **Modals:** Use `DraggableModal`.
  - **KPIs:** Use `KpiCard`.
- If a shared component exists, you **MUST** use it instead of writing custom code.

## 2. Self-Audit Step
- Before completing any task, perform a "Shared Component Audit":
  - Did I create any UI elements that could be useful in other pages?
  - If yes, move them to `src/components/shared/` and update the current page to use the shared version.

## 2. File Structure & Modularity
- **NEVER** create a single file larger than 300 lines for a page.
- **ALWAYS** extract sub-components into a `components/` folder relative to the page (e.g., `src/pages/Home/components/`).
- Use functional components and TypeScript interfaces for all props.

## 3. Standardized Features
- **Modals:** Use `DraggableModal`.
- **Data Tables:** Integrate with `CsvExport`.
- **Forms:** Use `sweetalert2` for success/error notifications.
- **Security:** Always include eye-toggle for sensitive fields.

## 4. Performance & Optimization
- **Caching:** Use the `cache` utility from `api.ts` for static data (e.g., employee lists, categories).
  - Example: `const data = cache.get('users') || await api.post('read', 'Users');`
- **Batch Operations:** Always send data as an array to `api.post('write', ...)` to trigger batch processing.
- **Auto-Cleanup:** Ensure the Google Apps Script includes the `deleteRows` logic to keep sheets lean.
- **Motion:** Use `motion` for all transitions to ensure a premium feel.
