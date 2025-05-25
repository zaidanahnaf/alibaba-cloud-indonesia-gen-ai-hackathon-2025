import instance from "./instance";

const ENDPOINT = ''

export const example = async (data: any) => {
    try{
        const res = await instance.post(`${ENDPOINT}/`, data)
        console.log("Data : ", res)
        return res.data.data
    } catch (e) {
        console.error(e, "Error in  API");
        throw e;
    }
}