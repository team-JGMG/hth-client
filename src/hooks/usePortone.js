
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toast'
import { requestChargeMerchantUid, verifyPayment } from '@/api/point'

export function usePortone() {
  const authStore = useAuthStore()
  const toast = useToastStore()

  const processPayment = (amount, name = '반의 반 집 포인트 충전') => {
    return new Promise(async (resolve, reject) => {
      if (!authStore.getIsLoggedIn) {
        toast.warn({ title: '로그인이 필요합니다', body: '로그인 후 이용해주세요.' })
        return reject(new Error('로그인이 필요합니다.'))
      }

      const paymentAmount = Number(amount)
      if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
        toast.warn({ title: '금액 확인', body: '결제할 금액을 확인해주세요.' })
        return reject(new Error('결제할 금액을 확인해주세요.'))
      }

      try {
        const merchant_uid = await requestChargeMerchantUid(paymentAmount)
        if (!merchant_uid) {
          toast.error({ title: '결제 식별자 발급 실패', body: '충전 요청을 다시 시도해주세요.' })
          return reject(new Error('결제 식별자 발급 실패'))
        }

        const { IMP } = window
        if (!IMP) {
          toast.error({ title: '로드 실패', body: 'PortOne 스크립트가 로드되지 않았습니다.' })
          return reject(new Error('PortOne 스크립트가 로드되지 않았습니다.'))
        }
        if (!import.meta.env.VITE_PORTONE_IMP_KEY) {
          toast.error({ title: '오류', body: '포트원 키가 설정되지 않았습니다.' })
          return reject(new Error('포트원 키가 설정되지 않았습니다.'))
        }

        IMP.init(import.meta.env.VITE_PORTONE_IMP_KEY)
        IMP.request_pay(
          {
            pg: 'kakaopay.TC0ONETIME',
            pay_method: 'card',
            name,
            amount: paymentAmount,
            merchant_uid,
            buyer_email: authStore.userInfo?.email || 'guest@example.com',
            buyer_name: authStore.userName || '비회원',
            buyer_tel: '010-0000-0000',
            buyer_addr: '서울특별시',
            buyer_postcode: '00000',
            m_redirect_url: `${window.location.origin}/payment-complete`,
          },
          async (rsp) => {
            if (!rsp?.success) {
              toast.error({ title: '결제 실패', body: rsp?.error_msg || '사용자 취소 또는 오류' })
              return reject(new Error(rsp?.error_msg || '사용자 취소 또는 오류'))
            }

            try {
              const verificationResult = await verifyPayment({
                impUid: rsp.imp_uid,
                amount: rsp.paid_amount,
                merchantUid: merchant_uid,
              })
              toast.success({ title: '결제 완료', body: '결제가 성공적으로 완료되었습니다.' })
              resolve(verificationResult)
            } catch (err) {
              toast.error({
                title: '검증 실패',
                body: err?.response?.data?.message || err?.message || '서버 검증 실패',
              })
              reject(err)
            }
          },
        )
      } catch (err) {
        toast.error({
          title: '요청 오류',
          body: err?.response?.data?.message || err?.message || '결제 요청 오류',
        })
        reject(err)
      }
    })
  }

  return { processPayment }
}
