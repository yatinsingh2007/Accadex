"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute h-full w-full inset-0 bg-neutral-950",
                className
            )}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#10b981,transparent)] opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_400px,#0ea5e9,transparent)] opacity-10" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_60s_linear_infinite] opacity-30">
                    <div className="absolute top-[50%] left-[50%] w-full h-full bg-linear-to-r from-transparent via-emerald-500/10 to-transparent blur-3xl transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
                    <div className="absolute top-[50%] left-[50%] w-full h-full bg-linear-to-r from-transparent via-cyan-500/10 to-transparent blur-3xl transform -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                </div>
            </div>
        </div>
    );
};
