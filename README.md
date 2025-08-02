# E-bebek Product Carousel Project

This project is a pixel-perfect clone of the product carousel on the E-bebek homepage.

# Features

- Fetch Product Data: retrieving product information from an external URL with GET request.
- Local Storage Usage: caching the product data in localStorage.
- Favorite Functionality: storing the users' favorite in localStorage.
- Responsive Design: adapting different screen sizes.

## Setup & Execution

You can run this project directly from your browser on the E-bebek homepage.

### Steps:

1. **Copy the Code**  
   Get the content of the `GONULMELIHA_MANAV.js` file (provided in this repository).

2. **Open Developer Tools**  
   Go to [https://www.e-bebek.com](https://www.e-bebek.com)  
   Press `F12` or `Ctrl+Shift+I` to open the developer tools.

3. **Navigate to Console Tab**  
   Switch to the **Console** panel.

4. **Paste & Run**  
   Paste the copied code and press `Enter`.

A product carousel will be injected below the “stories” section. An example given below. 

<img width="1468" height="872" alt="Screenshot 2025-08-02 at 12 08 15 PM" src="https://github.com/user-attachments/assets/d5c90c4e-52a6-4e31-ba74-2e6148b75cd5" />


---

## Code Structure

| Function          | Purpose                                                       |
| ----------------- | ------------------------------------------------------------- |
| `init()`          | Entry point. Fetches data, builds layout, styles, and events. |
| `fetchProducts()` | Loads product list from remote or `localStorage`.             |
| `buildHTML()`     | Dynamically creates and appends carousel HTML.                |
| `buildCSS()`      | Injects responsive CSS styles directly via `<style>`.         |
| `setEvents()`     | Handles user actions like clicking and favoriting.            |
| `handleResize()`  | Adapts visible products based on screen size.                 |
| `updateSlider()`  | Manages carousel scrolling logic.                             |

---

## File Overview

- `GONULMELIHA_MANAV.js`: Main and only file needed to run the project. Self-contained.

---
