# The Rolling Dough — Live Neapolitan Pizza Catering

A web application built with **React 19**, **Vite**, **TailwindCSS**, **Framer Motion**, **GSAP**, and **Firebase**.

## Features
- **Client Web Experience**: Includes Hero video showreel, Story section, Live Catering workflow, Wood-Fired Menu with dynamic filtering, Packages, Lightbox Gallery, Reviews, Interactive Location Selector (Ahmedabad, Vadodara, Nadiad, Anand), and Booking Form with direct Firestore integration.
- **Admin Dashboard Portal (`/admin`)**: Secure administrative view allowing authenticated admins to manage bookings, add/delete menu items, update gallery photos, and delete guest reviews.
- **Firebase & Mock Integration**: Fully configured to connect to Firebase Firestore/Auth. Supports a seamless local fallback mode if environment credentials are omitted.

## Environment Variables
Create a `.env` file at the project root with the following variables:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Admin Mock Access
To test the admin panel without custom Firebase Auth set up:
- URL: `/admin`
- Email: `admin@therollingdough.in`
- Password: `admin123`

## Deployment
- **Firebase Hosting**: Run `npm run build` and then `firebase deploy`.
- **Vercel**: Pre-configured with `vercel.json` for single page application routing.
