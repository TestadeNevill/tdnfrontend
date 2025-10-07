// src/analytics/VercelSPAView.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function VercelSPAView() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    if (window.va) window.va('pageview');
  }, [pathname, search]);
  return null;
}
