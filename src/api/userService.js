import { get, post, put, patch, del } from './axiosConfig'

export const getUsersPaginated = async(page=1, perPage=10) => {
    try{
        const response = await get('/users', {
            page, per_page:perPage 
        }, {
            requiresApiKey: true
        })
        return response
    }
    catch(error){
        throw error
    }
}