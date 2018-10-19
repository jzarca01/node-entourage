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
                'X-API-KEY': apiKey
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

    async getFeeds({latitude, longitude}, distance = 10, timeRange = 720, before = moment().format('YYYY-MM-DD HH:mm:ss ZZ')) {
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
                    time_range: timeRange,
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

    async getFeedsByType(type, {latitude, longitude}, distance = 10, timeRange = 720, before = moment().format('YYYY-MM-DD HH:mm:ss ZZ')) {
        try {
            const feeds = await this.getFeeds({latitude, longitude}, distance, timeRange, before)
            return feeds.feeds.filter(feed => feed.data.entourage_type === type)
        } catch (err) {
            console.log('error with getFeedsByType', err)
        }
    }

    async participate(entourageId, distance) {
        try {
            const participation = await this.request({
                method: 'POST',
                url: `/entourages/${entourageId}/users`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: {
                    distance: distance
                },
                responseType: 'json'
            })
            return participation.data
        } catch (err) {
            console.log('error with participate', err)
        }
    }

    async addMessageToParticipation(entourageId, message) {
        try {
            const participation = await this.request({
                method: 'PUT',
                url: `/entourages/${entourageId}/users`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: {
                    request: {
                        message: message
                    }
                },
                responseType: 'json'
            })
            return participation.data
        } catch (err) {
            console.log('error with addMessageToParticipation', err)
        }
    }

    async sendParticipation(entourageId, distance, message) {
        try {
            const participation = await this.participate(entourageId, distance)
            const addedMessage = await this.addMessageToParticipation(entourageId, message)
            return {...participation, ...addedMessage}
        }
        catch(err) {
            console.log('error with addMessageToParticipation', err)
        }
    }

    async getPOIS(categoryIds = [1,2,3,4,5,6,7], {latitude, longitude}, distance) {
        try {
            const pois = await this.request({
                method: 'GET',
                url: '/pois',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: {
                    categoryIds: categoryIds.join(),
                    latitude: latitude,
                    longitude: longitude,
                    distance: distance
                },
                responseType: 'json'
            })
            return pois.data
        } catch (err) {
            console.log('error with getPOIS', err)
        }
    }
}

module.exports = Entourage;