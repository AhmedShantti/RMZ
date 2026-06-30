"use client";

import { createContext, useContext } from "react";

export const AboutAnimationContext = createContext(0);

export function useAboutProgress() {
  return useContext(AboutAnimationContext);
}