import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
export interface ITruckState {
    status: number,
    points: any,
    index: number
}


@Module({ dynamic: true, store, name: 'truck' })
class Truck extends VuexModule implements ITruckState {
    public status: number = 0;
    public points = [];
    public index = 0;

    @Mutation

    private CHANGE_PLAY_INDEX(n: number) {
        this.index = n
    }
    @Mutation
    private CHANGE_ALL_POINTES(p: any) {
        this.points = p
    }
    @Mutation
    private CHANGE_PLAY_STATUS(s: number) {
        this.status = s
    }
    @Action
    private change_play_index(i: number) {
        this.CHANGE_PLAY_INDEX(i);
    }
    @Action
    private change_all_points(p: any) {

        this.CHANGE_ALL_POINTES(p);
    }
    @Action
    private change_play_status(s: number) {
        this.CHANGE_PLAY_STATUS(s);
    }

    
    get truckPlayStatus() {
        return this.status;
    }
    get truckPlayIndex() {
        return this.index;
    }
    get truckAllPoints() {
        return this.points
    }

}
export const PermissionModule = getModule(Truck)




