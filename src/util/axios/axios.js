import axios from 'axios'

// axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/',  // 프록시된 기본 경로
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
});

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