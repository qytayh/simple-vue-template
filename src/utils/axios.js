import axios from 'axios'
import {
  Message
} from 'element-ui'
axios.defaults.baseURL = process.env.VUE_APP_BASE_API
axios.defaults.timeout = 10000;
// request interceptor
axios.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers.token = localStorage.getItem('token')
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
axios.interceptors.response.use(
  response => {
    // const res = response.data
    // if (res.code !== 200) {
    //   Message({
    //     message: res.msg || 'Error check your token or method',
    //     type: 'error',
    //     duration: 2 * 1000
    //   })
      // return Promise.reject(new Error(res.msg || 'Error'))
    // } else {
    //   return res
    // }
    return response.data
  },
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 2 * 1000
    // })
    // return Promise.reject(error)
    return Promise.resolve(error.response);
  }
)

export default {
  post(url, params) {
    return axios.request({
      method: "post",
      url,
      data: params
    }).then(response => {
      return response;
    });
  },
  get(url, params) {
    return axios({
      method: "get",
      url,
      params
    }).then(response => {
      return response;
    });
  },
  put(url, params) {
    return axios({
      method: "put",
      url,
      data: params
    }).then(response => {
      return response;
    });
  },
  delete(url, params) {
    return axios({
      method: "delete",
      url,
      data: params
    }).then(response => {
      return response;
    });
  }
  // service.request
}
