import { useContext } from "react";
import { ToolContext, ToolUpdateContext } from "./ToolContext";

export function useToolRef() {
    return useContext(ToolContext)
}

export function useToolUpdate(){
    return useContext(ToolUpdateContext)
}