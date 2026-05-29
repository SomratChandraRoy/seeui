# SeeUI — Live UI Color Tester & Typography Playground

![SeeUI Presentation](https://github.com/SomratChandraRoy/seeui/assets/placeholder.png) <!-- Update with actual screenshot link -->

**SeeUI** is a zero-code design tool tailored for developers and designers. It stops the CSS guessing game by allowing you to test website background colors, text contrast, and typography instantly. Upload your brand logo, preview 40+ Google Fonts in real-time, and check WCAG contrast scores on the fly.

🌐 **Live Demo:** [https://seeui.bipul.tech](https://seeui.bipul.tech)

## ✨ Core Features

- **Live CSS Color Preview:** Dynamically pick any background or text color using HEX, RGB, HSL, or CMYK.
- **Typography Playground:** Instantly preview over 40+ Google Fonts. Adjust sizes and weights to see how they look against your chosen colors.
- **WCAG Contrast Checker:** Automatically checks contrast ratios to ensure your text is readable against your background.
- **Logo Matcher:** Upload your brand logo and visually match website color schemes to your brand identity.
- **Draggable UI Panels:** Floating, draggable panels for color picking and typography selection for an un-obstructed design experience.
- **Desktop-First Experience:** Optimized for desktop to give you the full power of draggable panels. Mobile users are gently guided to use the desktop version for the best experience.
- **Integrated Support/Donation:** Built-in donation system powered by Stripe and Appwrite Functions.

## 🛠 Tech Stack

- **Frontend Framework:** React (with React Router v7 in SPA mode)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS & Vanilla CSS (for dynamic styling)
- **Icons:** Lucide React
- **Backend / Functions:** Appwrite (Cloud Functions for Stripe integration)
- **Payments:** Stripe

## 🚀 Local Development Setup

### Prerequisites

- Node.js (v18+)
- npm or pnpm
- An Appwrite account (for the donation function)
- A Stripe account (for donation integration)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SomratChandraRoy/seeui.git
   cd seeui
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory based on the provided configuration:

   ```env
   VITE_SITE_URL=http://localhost:4000

   # Appwrite Config
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1 # Or your specific region endpoint (e.g., fra.cloud.appwrite.io)
   VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
   VITE_APPWRITE_FUNCTION_ID=your_appwrite_function_id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be running at `http://localhost:4000`.

## 📦 Deployment (Appwrite Sites)

This project is configured to be deployed easily using Appwrite Static Hosting.

1. **Build the project:**

   ```bash
   npm run build
   ```

   _(Note: The build script automatically copies the React Router output from `build/client` to `dist` for Appwrite compatibility)._

2. **Deploy to Appwrite:**
   In your Appwrite Console, navigate to **Hosting / Sites**, create a new site, and set the following:
   - **Install command:** `npm install`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Root document:** `index.html`

   **Don't forget to add the environment variables** (`VITE_APPWRITE_ENDPOINT`, `VITE_APPWRITE_PROJECT_ID`, `VITE_APPWRITE_FUNCTION_ID`) in the Appwrite Site settings.

## 💳 Setting up the Stripe Donation System

To enable the "Support" feature, you must deploy the accompanying Appwrite Function.

1. **Get the Code:**
   The function code is located in `appwrite-fn/create-checkout/`.

2. **Create the Function in Appwrite:**
   - Go to **Functions** > **Create Function**.
   - Name: `create-checkout`
   - Runtime: **Node.js 18.0**

3. **Set Function Environment Variables:**
   - `STRIPE_SECRET_KEY`: Your live or test Stripe Secret Key.
   - `CLIENT_URL`: Your live domain (e.g., `https://seeui.app`).

4. **Deploy the Function:**
   - Zip/Tar the contents of the `appwrite-fn/create-checkout/` directory and upload it via the Appwrite Console (Manual Deploy).
   - Entrypoint: `src/main.js`
   - Set **Execute Access** to `Any`.

5. **Connect Frontend to Function:**
   Grab the Function ID and Project ID and update your `.env.production` (and Appwrite Sites environment variables).

## 📄 License

This project is created for developers and designers to improve their workflow. Feel free to use and get inspired!

---

_Developed with ❤️ by [Bipul Roy](https://github.com/SomratChandraRoy)._
