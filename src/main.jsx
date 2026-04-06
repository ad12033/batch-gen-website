import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LandingPage from "./LandingPage.jsx";
import PrivacyPage from "./PrivacyPage.jsx";

const path = window.location.pathname.replace(/\/+$/, "") || "/";
const Page = path === "/privacy" ? PrivacyPage : LandingPage;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
