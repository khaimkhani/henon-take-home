
export const BASE_URL = "http://localhost:8001"

export const withParams = (queryKey, params) => {
  var endpoint = queryKey + '?'
  Object.entries(params).forEach(kv => endpoint += `${kv[0]}=${kv[1]}&`)
  return endpoint
}

export const defaultQueryFn = async (data) => {

  const { queryKey } = data
  let url = `${BASE_URL}/api/${queryKey[0]}`

  if (!!data.pageParam) {
    url += url.endsWith('&') ? `page=${data.pageParam}` : `?page=${data.pageParam}`
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem('userID')
    }
  })

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return res.json()
}

export const defaultMutationFn = async ({ endpoint, data, contentType = 'application/json' }) => {
  const stringify = contentType === 'application/json'
  const res = await fetch(`${BASE_URL}/api/${endpoint}/`, {
    method: 'POST', headers: {
      'Content-Type': contentType,
      'Authorization': localStorage.getItem('userID')
    },
    body: stringify ? JSON.stringify(data) : data
  })

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return res.json()

}
