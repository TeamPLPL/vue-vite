import { reactive, readonly } from "vue";
import apiWrapper from "../axios/axios";

const state = reactive({
  wishlist: [],
});

const mutations = {
  setWishlist(wishlist) {
    state.wishlist = wishlist;
  },
  addToWishlist(fundingId) {
    state.wishlist.push(fundingId);
  },
  removeFromWishlist(fundingId) {
    state.wishlist = state.wishlist.filter((id) => id !== fundingId);
  },
};

const actions = {
  async fetchWishlist() {
    const response = apiWrapper.getWishlist();
    mutations.setWishlist(response.data);
  },
  async updateWishlistInDB() {
    await axios.post("/api/wish/update", state.wishlist);
  },
};

const getters = {
  isInWishlist: (fundingId) => state.wishlist.includes(fundingId),
};

export default {
  state: readonly(state),
  mutations,
  actions,
  getters,
};
