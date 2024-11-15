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

// 작성자 : 신은호, 작성 날짜 : 24-11-15
/*
    작성 내용 : 401에러, 토큰 만료되면, login으로 돌아가기
*/
apiClient.interceptors.response.use(
    (response) => {
        // 응답이 정상일 경우 그대로 반환
        return response;
    },
    (error) => {
        // 에러 응답 처리
        if (error.response && error.response.status === 401) {
            // 토큰 만료 시 로그인 페이지로 리다이렉트
            alert('인증이 만료되었습니다. 다시 로그인해 주세요.');
            router.push('/login');  // Vue Router를 사용할 경우 router.push('/login')를 사용
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
};

export default apiWrapper;