/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { UserContext } from "../contexts/user";
import { UserType } from "../contexts/user";
import { IsLoadingContext } from "../contexts/isLoading";
import Navbar from "../components/Navbar";
import { PopupContext, PopupType } from "../contexts/popup";
import LoadingBar from "react-top-loading-bar";
import FadeLoader from "react-spinners/FadeLoader";

function MyApp({ Component, pageProps }) {
  // make a post request to "/api/whoami" to get the user's info
  // if the user is not logged in, redirect to the login page
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [popup, setPopup] = useState<PopupType>(null);
  const [progress, setProgress] = useState(0);
  const { redirectPage } = pageProps;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/whoami", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const datas = await res.json();

      if (datas.type === "SUCCESS") {
        setUser(datas.data);
      } else {
        router.push("/login");
      }

      setIsLoading(false);
    };

    if (!user) {
      if (!redirectPage) {
        setIsLoading(true);
        fetchUser();
      }
    }
  }, [user]);

  useEffect(() => {
    const handleStart = (url: string) => {
      setProgress(30);
    };
    const handleComplete = (url: string) => {
      setProgress(100);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <IsLoadingContext.Provider value={{ isLoading, setIsLoading }}>
          <PopupContext.Provider value={{ popup, setPopup }}>
            {/* <Navbar /> */}
            {!redirectPage && <Navbar />}
            <LoadingBar
              color="#ff0084"
              height={3}
              progress={progress}
              onLoaderFinished={() => setProgress(0)}
            />
            {isLoading && (
              <div id="preloader">
                <FadeLoader
                  className="spinner"
                  color="#ff5500"
                  loading={isLoading}
                />
              </div>
            )}
            <main
              style={{
                opacity: isLoading ? 0.2 : 1,
                background: redirectPage
                  ? "white"
                  : "linear-gradient(to left, #02aab0, #00cdac)",
              }}
            >
              <Component {...pageProps} />
            </main>
          </PopupContext.Provider>
        </IsLoadingContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default MyApp;
