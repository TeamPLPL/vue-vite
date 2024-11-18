import axios from 'axios'

// axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/',  // 프록시된 기본 경로
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
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
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
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
            console.error('GET 요청 에러:', error);
            throw error;
        }
    },

    // POST 요청 (예시: 회원가입)
    postData: async (url, data) => {
        try {
            const response = await apiClient.post(url, data);
            return response;
        } catch (error) {
            console.error('POST 요청 에러:', error);
            throw error;
        }
    },

    // PUT 요청 (예시: 사용자 정보 업데이트)
    putData: async (url, data) => {
        try {
            const response = await apiClient.put(url, data);
            return response.data;
        } catch (error) {
            console.error('PUT 요청 에러:', error);
            throw error;
        }
    },

    // DELETE 요청 (예시: 사용자 삭제)
    deleteData: async (url) => {
        try {
            const response = await apiClient.delete(url);
            return response.data;
        } catch (error) {
            console.error('DELETE 요청 에러:', error);
            throw error;
        }
    },

    // 로그인
    login: async (credentials) => {
        try {
            const response = await apiClient.post('/login', credentials);  // 프록시된 경로 사용
            return response.data;
        } catch (error) {
            console.error('로그인 에러:', error);
            throw error;
        }
    },

    // 로그아웃
    logout: async () => {
        try {
            const response = await apiClient.get('/logout');  // 로그아웃은 GET 요청
            return response.data;
        } catch (error) {
            console.error('로그아웃 에러:', error);
            throw error;
        }
    },

    // 회원가입
    signup: async (userData) => {
        try {
            const response = await apiClient.post('/signup', userData);
            return response.data;
        } catch (error) {
            console.error('회원가입 에러:', error);
            throw error;
        }
    },

    // 메인카테고리 리스트 조회
    fetchMainCategories: async () => {
        try {
            const response = await apiClient.get('api/funding/main-categories');
            return response.data;
        } catch (error) {
            console.error("메인 카테고리 API 요청 중 오류 발생:", error);
        }
    },

    // 메인카테고리 id별 서브 카테고리 리스트 조회
    fetchSubCategories: async (parentId) => {
        try {
        const response = await apiClient.get(`api/funding/sub-categories/${parentId}`);
        return response.data;
        } catch (error) {
        console.error("서브 카테고리 API 요청 중 오류 발생:", error);
        }
    },

    // 메인페이지 타입(최신, 인기)순 펀딩리스트 호출 함수
    fetchFundingList: async (type) => {
        try {
            const response = await apiClient.get(`api/funding/fundinglist/${type}`)
            return response.data
        } catch (error) {
            console.error(`${type}순 펀딩 리스트 요청 중 오류 발생:`, error)
            return []
        }
    },

    // 펀딩디테일 사이드바 내용 조회 함수
    fetchFundingData: async (id) => {
        try {
            const response = await apiClient.post(`api/funding/funding-data/${id}`)
            return response.data
        } catch (error) {
            console.error(`펀딩 프로젝트 ID: ${id}의 데이터 요청 중 오류 발생\n`, error)
            return null
        }
    },

    // 펀딩 리워드 사이드바 내용 조회 함수
    fetchRewardList: async (id) => {
        try {
            const response = await apiClient.get(`api/reward-list/all/${id}`)
            return response.data
        } catch (error) {
            console.error(`펀딩 프로젝트 ID: ${id}의 리워드 리스트 요청 중 오류 발생\n`, error)
            return null
        }
    },

    // 기본 주소 조회 함수
    getDefaultAddr: async () => {
        try {
            const response = await apiClient.post('api/address/default')
            console.log("axios에서 response: ", response)
            return response.data
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error("401 Unauthorized - 인증 오류 발생")
            } else {
                console.error(`기본 주소 조회 중 오류 발생\n`, error)
            }
            return null
        }
    },

    // 주소 저장
    saveAddress: async (addressData) => {
        try {
            console.log('Sending address data:', addressData); // 로깅 추가
            const response = await apiClient.post('api/address/new', addressData);
            console.log('Response from server:', response.data); // 응답 로깅
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error("401 Unauthorized - 인증 오류 발생");
            } else {
                console.error(`주소 저장 중 오류 발생\n`, error);
            }
            return null
        }
    },

    // 주소 목록 조회
    getAddressList: async () => {
        try {
            const response = await apiClient.post('api/address/list');
            console.log('Response from server:', response.data); // 응답 로깅
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error("401 Unauthorized - 인증 오류 발생");
            } else {
                console.error(`주소 목록 조회 중 오류 발생\n`, error);
            }
            return null
        }
    },

    // 펀딩이미지(썸네일, 펀딩디테일이미지들) 리스트 조회
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
            console.log('Response from server:', response.data);
            return response.data;
        } catch (error) {
            console.error(`펀딩 디테일 이미지 목록 조회 중 오류 발생\n`, error);
            return null;
        }
    },

    // 펀딩 환불 및 리워드 정보 조회
    fetchFundingInfo: async (id) => {
        try {
            const response = await apiClient.get(`api/reward-policy/${id}`);
            console.log('Response from server 펀딩리워드정보:', response.data);
            return response.data;
        } catch (error) {
            console.error(`펀딩 리워드 정보 및 환불 정책 조회 중 오류 발생\n`, error);
            return null;
        }
    },

    // MainCategoryId별 펀딩 목록 조회(페이징 처리)
    fetchFundingsByMainCategoryId: async (id, page = 0, size = Const.DEFAULT_PAGE_SIZE) => {
        try {
            const response = await apiClient.get(`api/funding/fundinglist/main/${id}`, {
                params: {
                    page: page,
                    size: size,
                    sort: 'supportCnt,DESC'
                }
            });
            console.log('Response from server fetchFundingsByMainCategoryId:', response.data);
            return response.data;
        } catch (error) {
            console.error(`fetchFundingsByMainCategoryId 중 오류 발생\n`, error);
            return null;
        }
    },
    
    // SubCategoryId별 펀딩 목록 조회(페이징 처리)
    fetchFundingsBySubCategoryId: async (id, page = 0, size = Const.DEFAULT_PAGE_SIZE) => {
        try {
            const response = await apiClient.get(`api/funding/fundinglist/sub/${id}`, {
                params: {
                    page: page,
                    size: size,
                    sort: 'supportCnt,DESC'
                }
            });
            console.log('Response from server fetchFundingsBySubCategoryId:', response.data);
            return response.data;
        } catch (error) {
            console.error(`fetchFundingsBySubCategoryId 중 오류 발생\n`, error);
            return null;
        }
    },

    getWishlist: async () => {
        try {
            const response = await apiClient.get('/api/wish/list');
            console.log('Response from server getWishlist:', response.data);
            return response.data;
        } catch (error) {
            console.error(`getWishlist 중 오류 발생\n`, error);
            return null;
        }
    },

    updateWishlist: async () => {
        try {
            const response = await apiClient.post('/api/wish/update');
            console.log("wishlist 목록 업데이트 성공")
        } catch (error) {
            console.error(`updateWishlist 중 오류 발생\n`, error);
        }
    },

};

export default apiWrapper;