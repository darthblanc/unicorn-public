import { useContext, useEffect } from "react";
import { AuthContext, AuthUpdateContext } from "./AuthContext";

export function useAuth() {
    return useContext(AuthContext)
}

export function useAuthUpdate() {
    return useContext(AuthUpdateContext)
}
