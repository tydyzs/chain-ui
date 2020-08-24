import request from '@/utils/request'

export const getList = (params) => {
    return request({
        url: '/git-system/menu/list',
        method: 'get',
        params: {
            ...params
        }
    })
}

export const getMenuList = (current, size, params) => {
    return request({
        url: '/git-system/menu/menu-list',
        method: 'get',
        params: {
            ...params,
            current,
            size,
        }
    })
}

export const remove = (ids) => {
    return request({
        url: '/git-system/menu/remove',
        method: 'post',
        params: {
            ids,
        }
    })
}

export const add = (row) => {
    return request({
        url: '/git-system/menu/submit',
        method: 'post',
        data: row
    })
}

export const update = (row) => {
    return request({
        url: '/git-system/menu/submit',
        method: 'post',
        data: row
    })
}

export const getMenu = (id) => {
    return request({
        url: '/git-system/menu/detail',
        method: 'get',
        params: {
            id,
        }
    })
}

export const getTopMenu = () => request({
    url: '/git-system/menu/top-menu',
    method: 'get'
});

export const getRoutes = (topMenuId) => request({
    url: '/git-system/menu/routes',
    method: 'get',
    params: {
        topMenuId,
    }
});

export const tree = () => request({
    url: '/git-system/menu/tree',
    method: 'get'
});

