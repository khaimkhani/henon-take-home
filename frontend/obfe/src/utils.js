export const withParams = (queryKey, params) => {
  var endpoint = queryKey + '?'
  Object.entries(params).forEach(kv => endpoint += `${kv[0]}=${kv[1]}&`)
  console.log(endpoint)
  return endpoint
}

export const defaultQueryFn = async (data) => {

  const { queryKey } = data
  const url = `http://localhost:8000/api/${queryKey[0]}`
  console.log(url)

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return res.json()
}

export const defaultMutationFn = async ({ endpoint, data }) => {

  const res = await fetch(`http://localhost:8000/api/${endpoint}/`, {
    method: 'POST', headers: {
      'Content-Type': 'application/json',
    }, body: JSON.stringify(data)
  })

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return res.json()

}
