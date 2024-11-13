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
    }
};

export default apiWrapper;