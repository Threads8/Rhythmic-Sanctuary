# Rhythmic Sanctuary - Menstrual Cycle Tracker & Wellness Hub

A full-stack, responsive, beautifully designed web application built with **Next.js**, **React**, **Tailwind CSS**, and **Firebase**. 
This application provides advanced menstrual cycle tracking paired with a supportive, empowering wellness module designed exclusively to adapt to the 4 phases of your body's natural cycle.

## ✨ Features
* **Dynamic Cycle Dashboard**: Real-time progress donut chart and dynamically adjusting UI based on whether you are in your Menstrual, Follicular, Ovulatory, or Luteal phase.
* **Daily Check-In & Symptom Tracking**: Advanced journaling, emotional balance sliders, flow intensity tracking, and interactive emoji-based mood logging.
* **"For You 💜" Wellness Core**: Phase-based daily affirmations, breathing exercises (with animated UI), and customizable daily goals.
* **Streak System & Insights**: Deep analytics with cycle consistency trends, top tracked symptoms, and emotional phase breakdowns.
* **Smart Calendar Engine**: Mathematically predicting the next period, fertile window, ovulation peak, and displaying custom cycle tile legends.
* **Responsive Sidebar UI (Mobile-First approach gracefully scaled to Desktop)**: Pastel "Rhythmic Sanctuary" themed aesthetic with smooth gradients.

---

## 🚀 Getting Started

To get a local instance up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed.
- Node.js (v18+ recommended)
- Firebase Project configured and `.env.local` populated with your active credentials.

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/your_username_/rhythmic-sanctuary.git
   ```
2. **Install NPM packages**
   ```sh
   npm install
   ```
3. **Set up Environment Variables**
   Create a `.env.local` file and add your Firebase configurations:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the Development Server**
   ```sh
   npm run dev
   ```

---

## 🌍 Deployment (Vercel Compatible)

This Next.js application is strictly-typed and fully Vercel compatible out-of-the-box (`vercel build` succeeds cleanly).

1. Push your repository to GitHub.
2. Sign in or create an account at [Vercel](https://vercel.com/).
3. Connect your GitHub repository.
4. Add the appropriate Firebase credentials inside Vercel's **Environment Variables** panel during setup.
5. Click **Deploy**. Vercel will automatically configure the build settings (`npm run build`) and start the `next start` command globally.

---

## 🛠️ Built With
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Cloud Firestore & Authentication](https://firebase.google.com/)
- [date-fns](https://date-fns.org/)
- [Lucide Icons](https://lucide.dev/)
- [Shadcn/UI Architecture](https://ui.shadcn.com/)

## 🎨 Theme Details
The color palette utilizes deep rose (`#8c494b`), warm peach (`#fcdbc6`), soft blush (`#faeded`), and crisp blues to provide a calming, supportive visual experience entirely void of sterile "medical app" designs.

## License
Distributed under the MIT License. See `LICENSE` for more information.
