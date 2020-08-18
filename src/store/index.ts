import Vue from 'vue';
import Vuex from 'vuex';
import { IAppState } from './modules/app';
import { IUserState } from './modules/user';
import { ITagsViewState } from './modules/tags-view'
import { IPermissionState } from './modules/permission'
import { ISettingsState } from './modules/settings'
import { IImState } from '@/im/store/modules/im'
import { ITruckState } from './modules/truck'
Vue.use(Vuex);

export interface IRootState {
  app: IAppState
  user: IUserState
  tagsView: ITagsViewState
  permission: IPermissionState
  im: IImState
  settings: ISettingsState,
  truck: ITruckState,
}

export default new Vuex.Store<IRootState>({});
