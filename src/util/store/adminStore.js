import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import homeIcon from '../../assets/home.png';
import chooseHomeIcon from '../../assets/choose_home.png';

export const useAdminStore = defineStore('admin', () => {
    const activeTab = ref('home'); // 초기값
    const dynamicHomeIcon = ref(chooseHomeIcon); // 현재 Home 아이콘

    const currentHomeIcon = computed(() => dynamicHomeIcon.value);

    function setActiveTab(tab) {
        activeTab.value = tab;

        // 특정 탭 클릭 시 homeIcon 변경
        if (['회원관리', '신고게시판', '프로젝트관리', '댓글관리'].includes(tab)) {
            dynamicHomeIcon.value = homeIcon;
        } else {
            dynamicHomeIcon.value = chooseHomeIcon;
        }
    }

    return { activeTab, setActiveTab, currentHomeIcon };
});
