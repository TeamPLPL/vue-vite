import axios from "axios";

// axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: "http://localhost:8080/", // 프록시된 기본 경로
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 작성자 : 신은호, 작성 날짜 : 24-11-13
/*
    작성 내용 : 모든 페이지에서 JWT 토큰 header에 추가,
    요청 인터셉터를 사용하여 각 요청에 토큰을 추가
*/
apiClient.interceptors.request.use(
    (config) => {
        // 로컬 스토리지에서 토큰을 가져와 Authorization 헤더에 추가
        const token = localStorage.getItem("jwtToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 작성자 : 신은호, 작성 날짜 : 24-11-15
/*
    작성 내용 : 401에러, 토큰 만료되면, login으로 돌아가기
*/
apiClient.interceptors.response.use(
    (response) => {
        // 응답이 정상일 경우 그대로 반환
        return response;
    },
    async (error) => {
        // 에러 응답 처리
        if (error.response && error.response.status === 401) {
            // 토큰 만료 시 로그인 페이지로 리다이렉트
            alert("인증이 만료되었습니다. 다시 로그인해 주세요.");
            await authStore.handleTokenExpiration();
            router.push("/login"); // Vue Router를 사용할 경우 router.push('/login')를 사용
        }
        return Promise.reject(error);
    }
);

// Wrapper 함수
const apiWrapper = {
    // GET 요청 (예시: 모든 사용자 정보 가져오기)
    getData: async (url, params = {}) => {
        try {
            const response = await apiClient.get(url, { params });
            return response.data;
        } catch (error) {
            console.error("GET 요청 에러:", error);
            throw error;
        }
    },

    // POST 요청 (예시: 회원가입)
    postData: async (url, data) => {
        try {
            const response = await apiClient.post(url, data);
            return response;
        } catch (error) {
            console.error("POST 요청 에러:", error);
            throw error;
        }
    },

    // PUT 요청 (예시: 사용자 정보 업데이트)
    putData: async (url, data) => {
        try {
            const response = await apiClient.put(url, data);
            return response.data;
        } catch (error) {
            console.error("PUT 요청 에러:", error);
            throw error;
        }
    },

    // DELETE 요청 (예시: 사용자 삭제)
    deleteData: async (url) => {
        try {
            const response = await apiClient.delete(url);
            return response.data;
        } catch (error) {
            console.error("DELETE 요청 에러:", error);
            throw error;
        }
    },

    // 로그인
    login: async (credentials) => {
        try {
            const response = await apiClient.post("/login", credentials); // 프록시된 경로 사용
            return response.data;
        } catch (error) {
            console.error("로그인 에러:", error);
            throw error;
        }
    },

    // 로그아웃
    logout: async () => {
        try {
            const response = await apiClient.get("/logout"); // 로그아웃은 GET 요청
            return response.data;
        } catch (error) {
            console.error("로그아웃 에러:", error);
            throw error;
        }
    },

    // 회원가입
    signup: async (userData) => {
        try {
            const response = await apiClient.post("/signup", userData);
            return response.data;
        } catch (error) {
            console.error("회원가입 에러:", error);
            throw error;
        }
    },

    // 작성자 : 신은호, 내용 : 파일 업로드 POST 요청
    postFileData: async (url, data, customHeaders = {}) => {
        try {
            const response = await apiClient.post(url, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...customHeaders, // 필요 시 사용자 정의 헤더 추가
                },
            });
            return response;
        } catch (error) {
            console.error("파일 업로드 요청 에러:", error);
            throw error;
        }
    },

    fetchMainCategories: async () => {
        try {
            const response = await apiClient.get("api/funding/main-categories");
            return response.data;
        } catch (error) {
            console.error("메인 카테고리 API 요청 중 오류 발생:", error);
        }
    },

    // 메인카테고리 id별 서브 카테고리 리스트 조회
    fetchSubCategories: async (parentId) => {
        try {
            const response = await apiClient.get(
                `api/funding/sub-categories/${parentId}`
            );
            return response.data;
        } catch (error) {
            console.error("서브 카테고리 API 요청 중 오류 발생:", error);
        }
    },

    // 메인페이지 타입(최신, 인기)순 펀딩리스트 호출 함수
    fetchFundingList: async (type) => {
        try {
            const response = await apiClient.get(
                `api/funding/fundinglist/${type}`
            );
            return response.data;
        } catch (error) {
            console.error(`${type}순 펀딩 리스트 요청 중 오류 발생:`, error);
            return [];
        }
    },

    // 펀딩디테일 사이드바 내용 조회 함수
    fetchFundingData: async (id) => {
        try {
            const response = await apiClient.post(
                `api/funding/funding-data/${id}`
            );
            return response.data;
        } catch (error) {
            console.error(
                `펀딩 프로젝트 ID: ${id}의 데이터 요청 중 오류 발생\n`,
                error
            );
            return null;
        }
    },

    // 펀딩 리워드 사이드바 내용 조회 함수
    fetchRewardList: async (id) => {
        try {
            const response = await apiClient.get(`api/reward-list/all/${id}`);
            return response.data;
        } catch (error) {
            console.error(
                `펀딩 프로젝트 ID: ${id}의 리워드 리스트 요청 중 오류 발생\n`,
                error
            );
            return null;
        }
    },

    // 기본 주소 조회 함수
    getDefaultAddr: async () => {
        try {
            const response = await apiClient.post("api/address/default");
            console.log("axios에서 response: ", response);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error("401 Unauthorized - 인증 오류 발생");
            } else {
                console.error(`기본 주소 조회 중 오류 발생\n`, error);
            }
            return null;
        }
    },

    // 주소 저장
    saveAddress: async (addressData) => {
        try {
            console.log("Sending address data:", addressData); // 로깅 추가
            const response = await apiClient.post(
                "api/address/new",
                addressData
            );
            console.log("Response from server:", response.data); // 응답 로깅
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error("401 Unauthorized - 인증 오류 발생");
            } else {
                console.error(`주소 저장 중 오류 발생\n`, error);
            }
            return null;
        }
    },

    // 주소 목록 조회
    getAddressList: async () => {
        try {
            const response = await apiClient.post("api/address/list");
            console.log("Response from server:", response.data); // 응답 로깅
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error("401 Unauthorized - 인증 오류 발생");
            } else {
                console.error(`주소 목록 조회 중 오류 발생\n`, error);
            }
            return null;
        }
    },

    fetchFundingImgList: async (id) => {
        try {
            const response = await apiClient.post(
                `api/funding/funding-imgs/${id}`,
                null, // POST 요청의 body (필요 없으면 null)
                {
                    headers: {
                        Accept: "application/json", // 명시적으로 JSON 응답 기대
                    },
                }
            );
            console.log("Response from server:", response.data);
            return response.data;
        } catch (error) {
            console.error(`펀딩 디테일 이미지 목록 조회 중 오류 발생\n`, error);
            return null;
        }
    },

    // fetchFundingImgList: async (id) => {
    //     try {
    //         const response = await apiClient.post(
    //             `api/funding/funding-imgs/${id}`,
    //             null, // POST 요청의 body (필요 없으면 null)
    //             {
    //                 headers: {
    //                     Accept: "application/json", // 명시적으로 JSON 응답 기대
    //                 },
    //             }
    //         );
    //         console.log('Response from server:', response.data);
    //         return response.data;
    //     } catch (error) {
    //         console.error(`펀딩 디테일 이미지 목록 조회 중 오류 발생\n`, error);
    //         return null;
    //     }
    // },

    // 펀딩 환불 및 리워드 정보 조회
    fetchFundingInfo: async (id) => {
        try {
            const response = await apiClient.get(`api/reward-policy/${id}`);
            console.log("Response from server 펀딩리워드정보:", response.data);
            return response.data;
        } catch (error) {
            console.error(
                `펀딩 리워드 정보 및 환불 정책 조회 중 오류 발생\n`,
                error
            );
            return null;
        }
    },

    // MainCategoryId별 펀딩 목록 조회(페이징 처리)
    fetchFundingsByMainCategoryId: async (
        id,
        page = 0,
        size = Const.DEFAULT_PAGE_SIZE
    ) => {
        try {
            const response = await apiClient.get(
                `api/funding/fundinglist/main/${id}`,
                {
                    params: {
                        page: page,
                        size: size,
                        sort: "supportCnt,DESC",
                    },
                }
            );
            console.log(
                "Response from server fetchFundingsByMainCategoryId:",
                response.data
            );
            return response.data;
        } catch (error) {
            console.error(
                `fetchFundingsByMainCategoryId 중 오류 발생\n`,
                error
            );
            return null;
        }
    },

    // SubCategoryId별 펀딩 목록 조회(페이징 처리)
    fetchFundingsBySubCategoryId: async (
        id,
        page = 0,
        size = Const.DEFAULT_PAGE_SIZE
    ) => {
        try {
            const response = await apiClient.get(
                `api/funding/fundinglist/sub/${id}`,
                {
                    params: {
                        page: page,
                        size: size,
                        sort: "supportCnt,DESC",
                    },
                }
            );
            console.log(
                "Response from server fetchFundingsBySubCategoryId:",
                response.data
            );
            return response.data;
        } catch (error) {
            console.error(`fetchFundingsBySubCategoryId 중 오류 발생\n`, error);
            return null;
        }
    },

    getWishlist: async () => {
        try {
            const response = await apiClient.get("/api/wish/list");
            console.log("Response from server getWishlist:", response.data);
            return response.data;
        } catch (error) {
            console.error(`getWishlist 중 오류 발생`, error);
            if (error.response && error.response.status === 401) {
                console.warn("Unauthorized access to wishlist.");
                return [];
            }
            throw error; // 에러를 호출자에게 전파
        }
    },
    addToWishlist: async (id) => {
        try {
            return await apiClient.post(`/api/wish/add/${id}`);
        } catch (error) {
            console.error("Failed to add to wishlist:", error);
            throw error; // 또는 사용자 정의 에러 객체를 throw
        }
    },
    removeFromWishlist: async (id) => {
        try {
            return await apiClient.delete(`/api/wish/remove/${id}`);
        } catch (error) {
            console.error("Failed to delete to wishlist:", error);
            throw error; // 또는 사용자 정의 에러 객체를 throw
        }
    },
    checkWishlistStatus: async (id) => {
        try {
            return await apiClient.get(`/api/wish/check/${id}`);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.warn(
                    "Unauthorized access to wishlist. User not authenticated."
                );
                // 인증 관련 처리
                // router.push('/login');
                return false;
            }
            console.error("Failed to check wishlist:", error);
            throw error; // 또는 사용자 정의 에러 객체를 throw
        }
    },
    updateWishlist: async (wishList) => {
        try {
            await apiClient.post("/api/wish/update", wishList);
            console.log("wishlist 목록 업데이트 성공");
            return true;
        } catch (error) {
            console.error(`updateWishlist 중 오류 발생`, error);
            if (error.response && error.response.status === 401) {
                console.warn(
                    "Unauthorized access to wishlist. User not authenticated."
                );
                // 인증 관련 처리
                // router.push('/login');
                alert("인증된 사용자가 아닙니다.\n(재)로그인하세요.");
                return false;
            }
            throw error; // 에러를 호출자에게 전파
        }
    },

    getSearchResult: async (title, page, size) => {
        try {
            const response = await apiClient.get("/api/funding/search", {
                params: {
                    title: title,
                    page: page - 1, // Spring Boot는 0-based 페이징을 사용
                    size: size, // 페이지 당 항목 수
                },
            });
            console.log("제목 검색 성공: " + response);
            return response;
        } catch (error) {
            console.error(`getSearchResult 중 오류 발생`, error);
            throw error; // 에러를 호출자에게 전파
        }
    },

    getNoticeList: async (id, page, size) => {
        try {
            const response = await apiClient.get(`/api/funding/${id}/notice`, {
                params: {
                    page: page,
                    size: size,
                },
            });
            console.log("펀딩 공지사항 불러오기 성공:", response);
            return response.data;
        } catch (error) {
            console.error(`getNoticeList 중 오류 발생`, error);
            if (error.response) {
                // 서버가 응답을 반환한 경우
                console.error("Error status:", error.response.status);
                console.error("Error data:", error.response.data);
            } else if (error.request) {
                // 요청이 전송되었지만 응답을 받지 못한 경우
                console.error("No response received:", error.request);
            } else {
                // 요청 설정 중 오류가 발생한 경우
                console.error("Error message:", error.message);
            }
            throw error;
        }
    },

    createNewNotice: async (id, notice) => {
        try {
            const response = await apiClient.post(
                `/api/funding/${id}/notice/create`,
                {
                    noticeTitle: notice.title,
                    noticeContent: notice.content,
                }
            );
            console.log("새 공지사항 등록 성공: " + response);
            return response;
        } catch (error) {
            console.error(`createNewNotice 중 오류 발생`, error);
            throw error; // 에러를 호출자에게 전파
        }
    },

    getNoticeDetail: async (id, noticeId) => {
        try {
            const response = await apiClient.get(
                `/api/funding/${id}/notice/${noticeId}`
            );
            console.log(
                "공지사항 조회 성공:",
                JSON.stringify(response.data, null, 2)
            );
            return response.data;
        } catch (error) {
            console.error(`createNewNotice 중 오류 발생`, error);
            throw error; // 에러를 호출자에게 전파
        }
    },

    updateNotice: async (id, notice) => {
        const noticeId = notice.noticeId;
        console.log(notice.noticeId, notice.title, notice.content);
        try {
            const response = await apiClient.put(
                `/api/funding/${id}/notice/${noticeId}`,
                {
                    noticeId: notice.noticeId,
                    noticeTitle: notice.noticeTitle,
                    noticeContent: notice.noticeContent,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("공지사항 수정 성공: " + response);
            return response;
        } catch (error) {
            console.error(`updateNotice 중 오류 발생`, error);
            throw error; // 에러를 호출자에게 전파
        }
    },

    deleteNotice: async (id, noticeId) => {
        try {
            const response = await apiClient.delete(
                `/api/funding/${id}/notice/${noticeId}`
            );
            console.log("공지사항 삭제 성공: " + response);
            return response;
        } catch (error) {
            console.error(`deleteNotice 중 오류 발생`, error);
            throw error; // 에러를 호출자에게 전파
        }
    },

    // checkAuthStatus: async () => {
    //     try {
    //         const response = await apiClient.get("/api/auth/status");
    //         console.log("Auth status response:", response.data);
    //         return response.data;
    //     } catch (error) {
    //         console.error("인증 상태 확인 중 오류 발생:", error);
    //         if (error.response && error.response.status === 401) {
    //             return { isAuthenticated: false };
    //         }
    //         throw error;
    //     }
    // },
};
export default apiWrapper;
