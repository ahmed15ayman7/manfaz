import axios from "axios"
import { apiUrl } from "@/constant"

export const getCategories = async (locale: string, limit: number = 10, page: number = 1, search: string = '',categoryId:string) => {
    let res = await axios.get(`${apiUrl}/stores/categories/all?lang=${locale}&limit=${limit}&page=${page}&search=${search}&categoryId=${categoryId}`)
    return res.data
}