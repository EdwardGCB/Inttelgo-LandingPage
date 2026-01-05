import {
  useGoogleAnalytics,
  usePageTimeTracking,
  useScrollTracking,
} from "@/hooks/useGoogleAnalytics";

export default function GoogleAnalytics() {
  useGoogleAnalytics();
  usePageTimeTracking();
  useScrollTracking();

  return null;
}
