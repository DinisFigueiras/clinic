export const ITEM_PER_PAGE = 15

type RouteAccessMap = {
    [key: string]: string[];
}

export const routeAccessMap: RouteAccessMap = {
    "/admin(.*)": ["admin"],
    "/list/patients": ["admin"],
    "/list/medication": ["admin"],
    "/calendar": ["admin"],
    "/profile": ["admin"],
    "/settings": ["admin"],
    "/logout": ["admin"],
}