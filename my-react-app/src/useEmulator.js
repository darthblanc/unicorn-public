import { useContext } from "react";
import { EmulatorContext } from "./EmulatorContext";

export function useEmulator() {
    return useContext(EmulatorContext);
}