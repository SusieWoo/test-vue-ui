import RequestService from '@/utils/request'
// import { AppModule } from "@/store/modules/app";

export default {

    revgeocode: (lng: string, lat: string) => {
        const at = `${lat},${lng}`
        return RequestService.request({
            url: process.env.VUE_APP_REVGEOCODE_API,
            method: 'get',
            params: { at }
        })
    },
}


