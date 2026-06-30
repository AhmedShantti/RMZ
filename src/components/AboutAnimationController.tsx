"use client";

import { useEffect, useRef, useState } from "react";
import { AboutAnimationContext } from "./AboutAnimationContext";

export default function AboutAnimationController({
    children,
}: {
    children: React.ReactNode;
}) {

    const [progress, setProgress] = useState(0);

    const last = useRef(-1);

    useEffect(() => {

        let raf = 0;

        const loop = () => {

            const max =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const p =
                max > 0
                    ? Math.min(
                        1,
                        Math.max(
                            0,
                            window.scrollY / max
                        )
                    )
                    : 0;

            if (Math.abs(p - last.current) > 0.0001) {
                last.current = p;
                setProgress(p);
            }

            raf = requestAnimationFrame(loop);
        };

        raf = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(raf);

    }, []);

    return (
        <AboutAnimationContext.Provider value={progress}>
            {children}
        </AboutAnimationContext.Provider>
    );
}