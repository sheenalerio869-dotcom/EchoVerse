import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Delay navigation until RootLayout is ready
    const timeout = setTimeout(() => {
      router.replace("/welcome");
    }, 0);

    return () => clearTimeout(timeout);
  }, [router]);

  return null;
}
