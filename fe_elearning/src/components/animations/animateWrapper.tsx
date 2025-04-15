"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimateWrapperProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  amount?: number;
}

const directionVariants = {
  up: { y: 20, opacity: 0 },
  down: { y: -20, opacity: 0 },
  left: { x: -20, opacity: 0 },
  right: { x: 20, opacity: 0 },
};

export default function AnimateWrapper({
  children,
  delay = 0,
  direction = "up",
  amount = 0,
}: AnimateWrapperProps) {
  return (
    <motion.div
      initial={directionVariants[direction]}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
