import { reactive, readonly } from "vue";
import apiWrapper from "../axios/axios";

const state = reactive({
  wishlist: [],
  isAuthenticated: false,
});

const mutations = {
  setWishlist(wishlist) {
    state.wishlist = wishlist;
  },
  addToWishlist(fundingId) {
    if (!state.wishlist.includes(fundingId)) {
      state.wishlist.push(fundingId);
    }
  },
  removeFromWishlist(fundingId) {
    state.wishlist = state.wishlist.filter((id) => id !== fundingId);
  },
  setIsAuthenticated(value) {
    state.isAuthenticated = value;
  },
};

const actions = {
  async fetchWishlist() {
    try {
      const response = await apiWrapper.getWishlist();
      mutations.setWishlist(response.data);
      mutations.setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      if (error.response && error.response.status === 401) {
        mutations.setIsAuthenticated(false);
      }
    }
  },
  async addToWishlist(fundingId) {
    try {
      await apiWrapper.addToWishlist(fundingId);
      mutations.addToWishlist(fundingId);
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      if (error.response && error.response.status === 401) {
        mutations.setIsAuthenticated(false);
      }
      throw error;
    }
  },
  async removeFromWishlist(fundingId) {
    try {
      await apiWrapper.removeFromWishlist(fundingId);
      mutations.removeFromWishlist(fundingId);
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      if (error.response && error.response.status === 401) {
        mutations.setIsAuthenticated(false);
      }
      throw error; // 에러를 다시 던져서 컴포넌트에서 처리할 수 있게 함
    }
  },
  async checkWishlistStatus(fundingId) {
    try {
      const response = await apiWrapper.checkWishlistStatus(fundingId);
      mutations.setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
      if (error.response && error.response.status === 401) {
        mutations.setIsAuthenticated(false);
      }
      return false;
    }
  },
};

const getters = {
  isInWishlist: (fundingId) => {
    return state.wishlist.includes(fundingId);
  },
  getIsAuthenticated: () => state.isAuthenticated,
};

export default {
  state: readonly(state),
  mutations,
  actions,
  getters,
};

// 페이징된 찜 리스트 조회 예시
// axios.get('/api/wish/list/paged', {
//   params: {
//     page: 0, // 원하는 페이지 번호
//     size: 10, // 원하는 페이지 크기
//   },
//   headers: {
//     Authorization: `Bearer ${yourToken}`,
//   },
// })
//   .then(response => {
//     console.log('Paged wishlists:', response.data);
//   })
//   .catch(error => {
//     console.error('Error fetching paged wishlists:', error);
//   });
