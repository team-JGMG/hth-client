import api from '@/libs/axios'

export const getAllocations = (fundingId) => {
  return api.get(`/api/allocations/${fundingId}`, {
    withCredentials: true,
  })
}

export const unwrapAllocations = (res) => {
  const root = res?.data
  return Array.isArray(root?.data?.content)
    ? root.data.content
    : Array.isArray(root?.data)
      ? root.data
      : Array.isArray(root)
        ? root
        : []
}
