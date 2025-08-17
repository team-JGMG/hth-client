import api from '@/libs/axios'

export const registerPropertyWithFormData = async ({
  requestData,
  photoFiles,
  documentFiles,
  documentTypes,
}) => {
  const formatDate = (value) => {
    if (!value) return null
    const d = new Date(value)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const finalData = {
    ...requestData,
    approvalDate: formatDate(requestData.approvalDate),
  }

  const formData = new FormData()

  const requestBlob = new Blob([JSON.stringify(finalData)], {
    type: 'application/json',
  })
  formData.append('request', requestBlob)

  photoFiles.forEach((file) => {
    formData.append('photoFiles', file)
  })

  documentFiles.forEach((file) => {
    formData.append('documentFiles', file)
  })

  const documentTypesBlob = new Blob([JSON.stringify(documentTypes)], {
    type: 'application/json',
  })
  formData.append('documentTypes', documentTypesBlob)

  return api.post('/api/auth/properties', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const fetchUserProperties = async () => {
  try {
    const statuses = ['pending', 'approved', 'rejected', 'sold']
    const allResults = await Promise.all(
      statuses.map((status) =>
        api.get(`/api/auth/properties`, {
          params: {
            page: 0,
            size: 10,
            status,
          },
        }),
      ),
    )
    const merged = allResults.flatMap((res) => res.data?.data?.content || [])

    return merged
  } catch {
    throw new Error()
  }
}

export const getSoldProperties = async () => {
  const response = await api.get('/api/properties/sold')
  return response.data
}

export const getPropertyMapData = async (propertyId) => {
  const response = await api.get(`/api/properties/map/${propertyId}`)
  return response.data
}

export const getCoordinatesByAddress = async (address) => {
  try {
    const { data } = await api.post('/api/properties/map/coordinate', JSON.stringify(address), {
      headers: { 'Content-Type': 'application/json' },
    })
    return data
  } catch (e) {
    if (e?.response?.status === 404) {
      const { data } = await api.get('/api/properties/map/coordinate', { params: { address } })
      return data
    }
    throw e
  }
}
export const getPropertyDetail = async (fundingId) => {
  const { data } = await api.get(`/api/fundings/${fundingId}`)
  return data
}

export const fetchUserPropertiesByStatus = async ({ status, page = 0, size = 10 }) => {
  const { data } = await api.get('/api/auth/users/me/properties', {
    params: { page, size, status },
  })
  return {
    content: data?.data?.content ?? [],
    last: !!data?.data?.last,
  }
}
