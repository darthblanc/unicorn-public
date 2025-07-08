import { useEffect, useState } from "react"

const getSessionStorageValue = ( key ) => {
    const savedValue =  JSON.parse(sessionStorage.getItem(key))
    if (savedValue) return savedValue
    return null
}

const getValue = (key, value) => {
    const rawStamp = sessionStorage.getItem(`Time${key}stamp`)
    const timestamp = JSON.parse(rawStamp)
    // console.log(value)
    if (value) {
        if (timestamp) {
            return value["timestamp"] >= timestamp ? value["timestamp"] : getSessionStorageValue(key)
        }
        else {
            return value
        }
    }
    return getSessionStorageValue(key)
}

export const useSessionStorage = (key, value) => {
    const [sessionValue, setSessionValue] =  useState(() => {
        return getValue(key, value)
    })

    useEffect(() => {
        if (sessionValue) {
            // console.log(sessionValue)
            sessionStorage.setItem(key, JSON.stringify(sessionValue))
            sessionStorage.setItem(`Time${key}stamp`, JSON.stringify(sessionValue["timestamp"]))
        }
    }, [sessionValue])

    return [sessionValue, setSessionValue]
}