// import { defineStore } from "pinia";
// import apiWrapper from "../axios/axios";

// export const useWishlistStore = defineStore("wishlist", {
//     state: () => ({
//         wishlist: [],
//         isAuthenticated: false,
//     }),

//     actions: {
//         async getWishlist() {
//             try {
//                 const response = await apiWrapper.getWishlist();
//                 this.wishlist = response.data;
//                 this.isAuthenticated = true;
//                 return response.data;
//             } catch (error) {
//                 console.error("Failed to fetch wishlist:", error);
//                 if (error.response?.status === 401) {
//                     this.isAuthenticated = false;
//                 }
//                 throw error;
//             }
//         },

//         async addToWishlist(fundingId) {
//             try {
//                 const response = await apiWrapper.addToWishlist(fundingId);
//                 if (!this.wishlist.includes(fundingId)) {
//                     this.wishlist.push(fundingId);
//                 }
//                 this.isAuthenticated = true;
//                 return response.data;
//             } catch (error) {
//                 console.error("Failed to add to wishlist:", error);
//                 if (error.response?.status === 401) {
//                     this.isAuthenticated = false;
//                 }
//                 throw error;
//             }
//         },

//         async removeFromWishlist(fundingId) {
//             try {
//                 const response = await apiWrapper.removeFromWishlist(fundingId);
//                 this.wishlist = this.wishlist.filter((id) => id !== fundingId);
//                 this.isAuthenticated = true;
//                 return response.data;
//             } catch (error) {
//                 console.error("Failed to remove from wishlist:", error);
//                 if (error.response?.status === 401) {
//                     this.isAuthenticated = false;
//                 }
//                 throw error;
//             }
//         },

//         async checkWishlistStatus(fundingId) {
//             try {
//                 await this.refreshAuthStatus();
//                 if (!this.isAuthenticated) {
//                     return false;
//                 }
//                 const response = await apiWrapper.checkWishlistStatus(
//                     fundingId
//                 );
//                 return response.data;
//             } catch (error) {
//                 console.error("Failed to check wishlist status:", error);
//                 if (error.response?.status === 401) {
//                     this.isAuthenticated = false;
//                 }
//                 return false;
//             }
//         },

//         async refreshAuthStatus() {
//             try {
//                 const response = await apiWrapper.checkAuthStatus();
//                 this.isAuthenticated = response.data.isAuthenticated;
//                 return this.isAuthenticated;
//             } catch (error) {
//                 console.error("인증 상태 확인 중 오류 발생:", error);
//                 this.isAuthenticated = false;
//                 return false;
//             }
//         },

//         setIsAuthenticated(value) {
//             this.isAuthenticated = value;
//         },
//     },

//     getters: {
//         isInWishlist: (state) => (fundingId) =>
//             state.wishlist.includes(fundingId),
//         getIsAuthenticated: (state) => state.isAuthenticated,
//     },
// });

import { defineStore } from "pinia";
import { storeToRefs } from "pinia";
import apiWrapper from "../axios/axios";
import { useAuthStore } from "./authStore"; // Import the authStore

export const useWishlistStore = defineStore("wishlist", {
    state: () => ({
        wishlist: [],
    }),

    actions: {
        async getWishlist() {
            const authStore = useAuthStore();
            const { isAuthenticated } = storeToRefs(authStore);

            try {
                const response = await apiWrapper.getWishlist();
                this.wishlist = response.data;
                return response.data;
            } catch (error) {
                console.error("Failed to fetch wishlist:", error);
                if (error.response?.status === 401) {
                    isAuthenticated.value = false;
                }
                throw error;
            }
        },

        async addToWishlist(fundingId) {
            const authStore = useAuthStore();
            const { isAuthenticated } = storeToRefs(authStore);

            try {
                const response = await apiWrapper.addToWishlist(fundingId);
                if (!this.wishlist.includes(fundingId)) {
                    this.wishlist.push(fundingId);
                }
                return response.data;
            } catch (error) {
                console.error("Failed to add to wishlist:", error);
                if (error.response?.status === 401) {
                    isAuthenticated.value = false;
                }
                throw error;
            }
        },

        async removeFromWishlist(fundingId) {
            const authStore = useAuthStore();
            const { isAuthenticated } = storeToRefs(authStore);

            try {
                const response = await apiWrapper.removeFromWishlist(fundingId);
                this.wishlist = this.wishlist.filter((id) => id !== fundingId);
                return response.data;
            } catch (error) {
                console.error("Failed to remove from wishlist:", error);
                if (error.response?.status === 401) {
                    isAuthenticated.value = false;
                }
                throw error;
            }
        },

        async checkWishlistStatus(fundingId) {
            const authStore = useAuthStore();
            const { isAuthenticated } = storeToRefs(authStore);

            if (!isAuthenticated.value) {
                return false;
            }

            try {
                const response = await apiWrapper.checkWishlistStatus(
                    fundingId
                );
                return response.data;
            } catch (error) {
                console.error("Failed to check wishlist status:", error);
                if (error.response?.status === 401) {
                    isAuthenticated.value = false;
                    authStore.logout(); // 로그아웃 처리 추가
                }
                return false;
            }
        },

        // async refreshAuthStatus() {
        //     const authStore = useAuthStore();
        //     const { isAuthenticated } = storeToRefs(authStore);

        //     try {
        //         const response = await apiWrapper.checkAuthStatus();
        //         isAuthenticated.value = response.data.isAuthenticated;
        //         return isAuthenticated.value;
        //     } catch (error) {
        //         console.error("인증 상태 확인 중 오류 발생:", error);
        //         isAuthenticated.value = false;
        //         return false;
        //     }
        // },
    },

    getters: {
        isInWishlist: (state) => (fundingId) =>
            state.wishlist.includes(fundingId),
        getIsAuthenticated() {
            const authStore = useAuthStore();
            return authStore.isAuthenticated;
        },
    },
});
