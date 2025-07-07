
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const router = useRouter();

  // Refs for GSAP animations
  const formRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const errorRef = useRef(null);
  const toastRef = useRef(null);
  const inputsRef = useRef([]);
  const buttonRef = useRef(null);
  const footerRef = useRef(null);
  const floatersRef = useRef([]);

  const backgrounds = [
    "/images/pc-setup-1.jpg",
    "/images/gaming-pc.jpg",
    "/images/tech-showcase.jpg",
    "https://i.postimg.cc/wjD3ZGy0/image.png", // External image
    // If external image fails, download it and use: "/images/new-background.png"
  ];

  useEffect(() => {
    // Initialize animations
    const tl = gsap.timeline();

    tl.from(logoRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
    });

    tl.from(titleRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.5,
    }, "-=0.3");

    tl.from(formRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.2");

    tl.from(inputsRef.current, {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4,
    }, "-=0.3");

    tl.from(buttonRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.4,
    }, "-=0.2");

    tl.from(footerRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.4,
    }, "-=0.1");

    floatersRef.current.forEach((floater, i) => {
      gsap.to(floater, {
        y: gsap.utils.random(-20, 20),
        x: gsap.utils.random(-20, 20),
        rotation: gsap.utils.random(-180, 180),
        duration: gsap.utils.random(8, 12),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2,
      });
    });

    // Background rotation
    const interval = setInterval(() => {
      setBackgroundIndex((prev) => {
        const next = (prev + 1) % backgrounds.length;
        console.log("Switching to background:", backgrounds[next]); // Debug
        return next;
      });
    }, 8000);

    return () => {
      clearInterval(interval);
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (error) {
      gsap.fromTo(
        errorRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 }
      );
    }
  }, [error]);

  useEffect(() => {
    if (showToast) {
      gsap.fromTo(
        toastRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 }
      );
    }
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    gsap.to(buttonRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          fullname,
          role: "USER",
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      // Show toast message
      setShowToast(true);
      setIsLoading(false);

      // Hide toast after 2 seconds and redirect
      setTimeout(() => {
        setShowToast(false);
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const addHoverEffect = (index) => {
    gsap.to(inputsRef.current[index], {
      scale: 1.01,
      duration: 0.2,
    });
  };

  const removeHoverEffect = (index) => {
    gsap.to(inputsRef.current[index], {
      scale: 1,
      duration: 0.2,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Image with Next.js Image component */}
      <Image
        src={backgrounds[backgroundIndex]}
        alt="Background"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        priority
        className="z-0 transition-opacity duration-1000"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20 z-0"></div>

      <div className="max-w-md w-full space-y-8 z-10">
        <div className="text-center">
          <div ref={logoRef}>
            <svg
              className="mx-auto h-16 w-16 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              ></path>
            </svg>
          </div>
          <h2
            ref={titleRef}
            className="mt-6 text-center text-3xl font-extrabold text-white"
          >
            Join <span className="text-blue-400">Tech Haven</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Create your account to explore PC hardware
          </p>
        </div>

        {error && (
          <div
            ref={errorRef}
            className="rounded-md bg-red-900 bg-opacity-80 p-4"
          >
            <div className="text-sm text-red-100">{error}</div>
          </div>
        )}

        {showToast && (
          <div
            ref={toastRef}
            className="rounded-md bg-green-900 bg-opacity-80 p-4"
          >
            <div className="text-sm text-green-100">Registration completed</div>
          </div>
        )}

        <form ref={formRef} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div
              ref={(el) => (inputsRef.current[0] = el)}
              onMouseEnter={() => addHoverEffect(0)}
              onMouseLeave={() => removeHoverEffect(0)}
            >
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-400 text-white bg-gray-800 bg-opacity-70 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div
              ref={(el) => (inputsRef.current[1] = el)}
              onMouseEnter={() => addHoverEffect(1)}
              onMouseLeave={() => removeHoverEffect(1)}
            >
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-400 text-white bg-gray-800 bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div
              ref={(el) => (inputsRef.current[2] = el)}
              onMouseEnter={() => addHoverEffect(2)}
              onMouseLeave={() => removeHoverEffect(2)}
            >
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-400 text-white bg-gray-800 bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div
              ref={(el) => (inputsRef.current[3] = el)}
              onMouseEnter={() => addHoverEffect(3)}
              onMouseLeave={() => removeHoverEffect(3)}
            >
              <label htmlFor="fullname" className="sr-only">
                Full Name
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                autoComplete="name"
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-400 text-white bg-gray-800 bg-opacity-70 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              ref={buttonRef}
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </form>

        <div ref={footerRef} className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (floatersRef.current[i] = el)}
            className="absolute text-gray-600 opacity-20"
            style={{
              fontSize: `${Math.random() * 20 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {["💻", "🖥️", "⌨️", "🖱️", "🔌", "⚡", "🔧", "🛠️"][i % 8]}
          </div>
        ))}
      </div>
    </div>
  );
}