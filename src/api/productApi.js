import axiosInstance from "./axiosConfig";

export const ProductAdd= async (productData)=>{
    try{
        const response = await axiosInstance.post("/product/add",productData);
        return response.data;
    }
    catch(error){
        throw error;
    }
};