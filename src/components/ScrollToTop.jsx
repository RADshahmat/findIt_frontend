import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const scrollPositions = {};

const ScrollRestoration = () => {
  const location = useLocation();
  const navType = useNavigationType(); // "POP", "PUSH", "REPLACE"

  useEffect(() => {
    // Restore scroll position for back/forward
    if (navType === "POP") {
      const storedY = scrollPositions[location.key];
      if (storedY !== undefined) {
        window.scrollTo({ top: storedY, behavior: "smooth" });
      }
    } else {
      // Scroll to top for normal navigation
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return () => {
      scrollPositions[location.key] = window.scrollY;
    };
  }, [location, navType]);

  return null;
};

export default ScrollRestoration;
