import api from "./axios";

export const loginUser = async ({email, password}) => {
    const res = await api.post("/auth/login", {
        email, password
    })
    return res
}

export const registerUser = async({email, name, password}) => {
    const res = await api.post("/auth/register", {
        email, password, name
    })

    return res
}


