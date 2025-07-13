// 전역 변수는 해당 위치에 작성해주세요!
export const VAR = 'test'

export const MENUS = [
    {
        name: 'home',
        label: '홈',
        icon: 'fa-house-chimney',
        path: '/home',
    },
    {
        name: 'payments',
        label: '소비',
        icon: 'fa-credit-card',
        path: '/payments',
    },
    {
        name: 'charts',
        label: '차트',
        icon: 'fa-chart-simple',
        path: '/charts',
    },
    {
        name: 'mypage',
        label: '마이',
        icon: 'fa-user',
        path: '/mypage',
    },
]

export const SPEND_TYPES = [
    { title: '가치 소비', textColor: 'text-blue' },
    { title: '낭비 소비', textColor: 'text-red' },
]

export const MY_PAGE_MENUS = [
    { title: '내 정보', elements: [{ name: '이름 설정', path: '/mypage/edit/name' }] },
    // { title: '시스템 설정', elements: [{ name: '테마 변경', path: '' }] },
    // {
    //     title: '기타',
    //     elements: [
    //         { name: '개발자 정보 확인', path: '' },
    //         { name: '고객 문의', path: '' },
    //     ],
    // },
]
