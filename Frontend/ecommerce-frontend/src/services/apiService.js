import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const apiService = {
    request: async (endpoint, data = null, method = 'get') => {
        try {

            const headers = {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            };

            // Get JWT token from local storage
            const jwtToken = localStorage.getItem('jwtToken');
            if (jwtToken) {
                headers['Authorization'] = `Bearer ${jwtToken}`;
            }
            const config = {
                method,
                url: `${BASE_URL}/${endpoint}`,
                headers,
                data
            };

            const response = await axios(config);
            return response.data;
        } catch (error) {
            throw error.response.data.message || 'Failed to process request';
        }
    }
};

export default apiService;