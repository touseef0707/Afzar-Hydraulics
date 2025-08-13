# Developer On-Boarding Guide

## Afzar-Hydraulics

Afzar-Hydraulics is a simulation and information platform developed for **Afzar Consultants LLC**, featuring a **Flask backend** and a **Next.js frontend**.
It was originally built during a **2-month internship** as a proof-of-concept for basic hydraulic simulations and company-related content.

While the project is no longer actively hosted, future developers are welcome to set it up locally or deploy it under their own account.

---

## ⭐ Before You Begin

1. **Clone this repository** (please star ⭐ this repo to show support).
2. If you open-source your own version, **credit this repository** in your README or docs.
3. This guide will walk you through setting up the environment so you can run the project locally.

---

## 📂 Project Structure

```
/flask-api      → Flask backend (simulation APIs)
/nextjs-main    → Next.js frontend (web interface)
```

* **Backend Deployment:** Flask API can be hosted on platforms like **Render**, **Railway**, or **Heroku**.
* **Frontend Deployment:** Next.js site can be hosted on **Vercel**, **Netlify**, or any Node-compatible server.

---

## ⚙️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/touseef0707/Afzar-Hydraulics.git
cd Afzar-Hydraulics
```

---

### 2. Install Dependencies

**Backend**

```bash
cd flask-api
pip install -r requirements.txt
```

**Frontend**

```bash
cd ../nextjs-main
npm install
```

---

### 3. Environment Variables

Create a `.env.local` file inside the **`nextjs-main/`** folder.
**Do NOT commit your real credentials.**
Use placeholders like this:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-firebase-rtdb-url

FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-email

# This should be the full JSON object from your Firebase Service Account, stringified into one line
FIREBASE_ADMIN_CREDENTIALS={"type":"service_account","project_id":"your-project-id","private_key_id":"your-key-id","private_key":"-----BEGIN PRIVATE KEY-----\\nYOUR-PRIVATE-KEY-HERE\\n-----END PRIVATE KEY-----\\n","client_email":"your-service-account-email","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email","universe_domain":"googleapis.com"}

COMPANY_NAME="AFZAR HYDRAULICS"

GMAIL_USER=your-gmail-address
GMAIL_PASSWORD=your-gmail-app-password

NEXT_PUBLIC_FLASK_API_URL=http://localhost:5000
```

### 4. Where to Get These Keys

To run the project, you will need several API keys and credentials. Here’s how to obtain them:

### Firebase API Keys
- Create a Firebase project.
- Enable **Realtime Database** and **Authentication**.
- Copy the API keys and other required configuration details for your `.env.local`.

**Docs:** [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)

---

### Firebase Admin Credentials
- Go to the Firebase Console → Project Settings → Service Accounts.
- Generate a **Service Account JSON** file.
- Add its contents to your `.env.local` as `FIREBASE_ADMIN_CREDENTIALS`.

**Docs:** [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)

---

### Google API Credentials
- We need to create OAuth credentials or service accounts.
- Download the JSON key file of the service account.

**Docs:** [Google Cloud Console](https://console.cloud.google.com/)

---

### Gmail App Password
- Enable **2-Step Verification (2FA)** on your Gmail account.
- Generate an **App Password** for your project.
- Use this password in `.env.local` as `GMAIL_PASSWORD`.

**Docs:** [Google App Passwords](https://support.google.com/accounts/answer/185833)

---

## 🚀 Running Locally

**Start Flask Backend**

```bash
cd flask-api
flask run
```

**Start Next.js Frontend**

```bash
cd ../nextjs-main
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deployment Steps

### Flask Backend

* Deploy to **Render**, **Railway**, **Heroku**, or any Python-friendly host.
* Set environment variables in the platform’s settings.

### Next.js Frontend

* Deploy to **Vercel** (recommended) or **Netlify**.
* Set `.env.local` variables in the hosting platform's dashboard.

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

## 📬 Contact

**Touseef Ahmed**
📧 [touseefahmed0707@gmail.com](mailto:touseefahmed0707@gmail.com)

---

If you’d like, I can also make a **diagram** showing the Firebase, Flask, and Next.js connection flow so onboarding devs can visualize it in 10 seconds.
Would you like me to add that visual to the guide?
