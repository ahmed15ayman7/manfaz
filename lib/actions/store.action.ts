import axios from "axios"
import { BASE_URL } from "@/lib/config"

export const getCategories = async (locale: string, limit: number = 10, page: number = 1, search: string = '', categoryId?: string, currentLocation?: any) => {
    let res = currentLocation !== null ? await axios.get(`${BASE_URL}/stores/categories/all?lang=${locale}&limit=${limit}&page=${page}&search=${search}&categoryId=${categoryId}${currentLocation ? `&longitude=${currentLocation.longitude}&latitude=${currentLocation.latitude}` : ''}`) : { data: [] };
    return res.data
}