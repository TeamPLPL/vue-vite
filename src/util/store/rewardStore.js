import { defineStore } from "pinia";

export const useRewardStore = defineStore("reward", {
    state: () => ({
        selectedRewards: [],
    }),
    actions: {
        setSelectedRewards(rewards) {
            this.selectedRewards = rewards;
        },
    },
});