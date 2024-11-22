import {defineStore} from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("authStore", {
    state: () => ({}),

    actions: {
        async getRedirectLink() {
            return new Promise<string>(async (resolve, reject) => {

                axios.get("http://localhost:8080/login").then(function (response) {
                    // en cas de réussite de la requête
                    console.log(response.data.link);

                    resolve(response.data.link);
                })
                .catch(function (error) {
                    // en cas d’échec de la requête
                    reject(error);
                })

            })
        },

        getAuthToken() {
            const token = document.cookie.split("; ")
                .find((row) => row.startsWith("access_token="))
                ?.split("=")[1];

            return token;
        }
    },
})