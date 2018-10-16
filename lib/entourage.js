const axios = require('axios');
const qs = require('qs');

class Entourage {
    constructor({
        apiKey
    }) {
        this.request = axios.create({
            baseURL: 'https://api.entourage.social/api/v1',
            headers: {
                'X-API-KEY': apiKey,
                'User-Agent': 'Entourage/5.5 (iPhone; iOS 11.4.1; Scale/2.00)'
            },
            paramsSerializer: function (params) {
                return qs.stringify(params)
            }
        });
    }

    setAccessToken(accessToken) {
        this.request.interceptors.request.use((axiosConfig) => {
            Object.assign(axiosConfig.params ? axiosConfig.params : {}, {
                token: accessToken
            })
            return axiosConfig;
        }, (error) => Promise.reject(error));
    }

    async login(phoneNumber, code) {
        try {
            const login = await this.request({
                method: 'POST',
                url: '/login',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: {
                    user: {
                        phone: phoneNumber,
                        sms_code: code
                    },
                },
                responseType: 'json'
            })
            const token = login.data.user.token
            this.setAccessToken(token)
            return login.data
        } catch (err) {
            console.log('error with login', err)
        }
    }
}

module.exports = Entourage;