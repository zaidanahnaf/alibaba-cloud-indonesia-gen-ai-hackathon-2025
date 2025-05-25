import instance from "./instance";

const CHAT = 'chat'

export const postChat = async (data: any) => {
    try{
        const res = await instance.post(`${CHAT}/post`, data)
        console.log("Data: ", res)
        return res.data.data
    } catch (e) {
        console.error(e, "Error in post chat API");
        throw e;
    }
}

export const getChatByCreator = async (creatorId: string) => {
    try{
        const res = await instance.get(`${CHAT}/${creatorId}`)
        console.log("Data: ", res)
        return res.data.data
    } catch (e) {
        console.error(e, "Error in get chat API");
        throw e;
    }
}

export const getChatById = async (id: string) => {
    try{
        const res = await instance.get(`${CHAT}/${id}`)
        console.log("Data: ", res)
        return res.data.data
    } catch (e) {
        console.error(e, "Error in get chat API");
        throw e;
    }
}