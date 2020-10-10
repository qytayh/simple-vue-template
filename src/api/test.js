import axios from '@/utils/axios'

export function getTableData(params) {
  return axios.get({
    url: 'getTableData',
    params
  })
}
