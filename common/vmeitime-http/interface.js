/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
import helper from '../helper'

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
typeof define === 'function' && define.amd ? define(factory) : (global.Qarticles = factory());
})(this, function () {
  return {
    config: {
      baseUrl: helper.apiUrl,
      header: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Content-Type': 'application/x-www-form-urlencoded'
      },  
      data: {},
      method: "GET",
      dataType: "json",  /* 如设为json，会对返回的数据做一次 JSON.parse */
      responseType: "text",
      success() {},
      fail() {},
      complete() {}
    },
    interceptor: {
			request: null,
			response: null
		},
    request(options) {
      if (!options) {
        options = {}
      }
      options.baseUrl = options.baseUrl || this.config.baseUrl
      options.dataType = options.dataType || this.config.dataType
      options.url = options.baseUrl + options.url
      options.data = options.data || {}
      options.method = options.method || this.config.method
       
      return new Promise((resolve, reject) => {
        let _config = null
        
        options.complete = (response) => {
          let statusCode = response.statusCode
          response.config = _config
          if (process.env.NODE_ENV === 'development') {
            if (statusCode === 200) {
              // console.log("【" + _config.requestId + "】 结果：" + JSON.stringify(response.data))
            }
          }
          if (this.interceptor.response) {
            let newResponse = this.interceptor.response(response)
            if (newResponse) {
              response = newResponse
            }
          }
          // 统一的响应日志记录
          // _reslog(response)
          if (statusCode === 200) { //成功
            resolve(response.data);
          } else {
            reject(response)
          }
        }

        _config = Object.assign({}, this.config, options)
        _config.requestId = new Date().getTime()

        if (this.interceptor.request) {
          this.interceptor.request(_config)
        }
        uni.request(_config);
      });
    },
    get(url, data, options) {
      if (!options) {
        options = {}
      }
      options.url = url
      options.data = data
      options.method = 'GET'  
      return this.request(options)
    },
    post(url, data, options) {
      if (!options) {
        options = {}
      }
      options.url = url
      options.data = data
      options.method = 'POST'
      return this.request(options)
    },
    put(url, data, options) {
      if (!options) {
        options = {}
      }
      options.url = url
      options.data = data
      options.method = 'PUT'
      return this.request(options)
    },
    delete(url, data, options) {
      if (!options) {
        options = {}
      }
      options.url = url
      options.data = data
      options.method = 'DELETE'
      return this.request(options)
    }
  }
})
