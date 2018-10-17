const axios = require('axios');
const qs = require('qs');
const moment = require('moment');

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

    async getFeeds({latitude, longitude}, distance = 10, before = moment().format('YYYY-MM-DD HH:mm:ss ZZ')) {
        try {
            const feeds = await this.request({
                method: 'GET',
                url: '/feeds',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: {
                    announcements: 'v1',
                    before: before,
                    time_range: 720,
                    show_my_entourages_only: false,
                    show_my_partners_only: false,
                    show_past_events: false,
                    latitude: latitude,
                    longitude: longitude,
                    distance: distance
                },
                responseType: 'json'
            })
            return feeds.data
        } catch (err) {
            console.log('error with getFeeds', err)
        }
    }

    async getFeedsByType(type, {latitude, longitude}, distance = 10, before = moment().format('YYYY-MM-DD HH:mm:ss ZZ')) {
        try {
            const feeds = await this.getFeeds({latitude, longitude}, distance, before)
            return feeds.feeds.filter(feed => feed.data.entourage_type === type)
        } catch (err) {
            console.log('error with getFeedsByType', err)
        }
    }
}

module.exports = Entourage;