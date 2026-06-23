import {createApi} from "@reduxjs/toolkit/query/react";
import {fetchBaseQuery} from "@reduxjs/toolkit/query";
import {BASE_URL, BASE_URL_API} from "@/api";
// import {serialize} from "object-to-formdata";
import type IRegisterModel from "../models/IRegisterModel.ts";
import type ILoginModel from "../models/ILoginModel.ts";
import {serialize} from "object-to-formdata";
import IMeModel from "@/models/IMeModel";
import * as SecureStore from "expo-secure-store";
import { IProfileUpdate } from "@/models/IProfileUpdate.js";
import IForgotPasswordModel from "@/models/IForgotPasswordModel";

export const authService = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL_API}/Account/`,
        prepareHeaders: async (headers) => {
            const token = await SecureStore.getItemAsync("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Auth'],
    endpoints: (build) => ({
        register: build.mutation<{token : string}, IRegisterModel>({
            query: (model)=>{
                const formData = serialize(model)
                return {
                    url: "Register",
                    method: "POST",
                    body: formData,
                }
            },
            invalidatesTags: ["Auth"]
        }),
        login: build.mutation<{token : string}, ILoginModel>({
            query: (model)=>{
                // const formData = serialize(model)
                return{
                    url: "Login",
                    method: "POST",
                    body: model,
                }
            }
        }),
        me: build.query<IMeModel, void>({
            query: () => ({ url: "Me", method: "GET" }),
            providesTags: ["Auth"],
            transformResponse: (response: IMeModel) => ({
                ...response,
                image: response.image
                    ? `${BASE_URL}/images/400_${response.image}`
                    : null,
            }),
        }),
        logout: build.mutation<void, void>({
            query: () => ({ url: "Logout", method: "POST" }),
            invalidatesTags: ["Auth"]
        }),
        updateProfile: build.mutation<IMeModel, IProfileUpdate>({
            query: (model) => {
                const formData = serialize(model);
                return {
                    url: "EditProfile",
                    method: "PUT",
                    body: formData,
                };
            },
            invalidatesTags: ["Auth"],
        }),
        forgotPassword: build.mutation<void, IForgotPasswordModel>({
            query: (model) => ({
                url: 'ForgotPassword',
                method: 'POST',
                body: model
            })
        }),
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useMeQuery,
    useUpdateProfileMutation,
    useForgotPasswordMutation,
} = authService;
