import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function Home() {
  const titleRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(titleRef.current, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1.5 });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
      <h1 ref={titleRef} className="text-5xl font-bold">Welcome to My Portfolio</h1>
    </div>
  );
}

export default Home;
