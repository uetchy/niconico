export interface ISmileInfo {
  url: string
  isSlowLine: boolean
  currentQualityId: string
  qualityIds: string[]
}

export interface IVideo {
  id: string
  title: string
  originalTitle: string
  description: string
  originalDescription: string
  thumbnailURL: string
  postedDateTime: string
  originalPostedDateTime?: any
  width: number
  height: number
  duration: number
  viewCount: number
  mylistCount: number
  translation: boolean
  translator?: any
  movieType: string
  badges?: any
  mainCommunityId?: any
  dmcInfo?: any
  backCommentType?: any
  channelId?: any
  isCommentExpired: boolean
  isWide?: boolean
  isOfficialAnime?: boolean
  isNoBanner?: boolean
  isDeleted: boolean
  isTranslated: boolean
  isR18: boolean
  isAdult: boolean
  isNicowari?: boolean
  isPublic: boolean
  isPublishedNicoscript?: boolean
  isNoNGS?: boolean
  isCommunityMemberOnly: string
  isCommonsTreeExists?: boolean
  isNoIchiba: boolean
  isOfficial: boolean
  isMonetized: boolean
  smileInfo: ISmileInfo
}

export interface IPlayer {
  playerInfoXMLUpdateTIme: number
  isContinuous: boolean
}

export interface IIds {
  default: string
  nicos?: any
  community?: any
}

export interface IThread {
  commentCount: number
  hasOwnerThread?: any
  mymemoryLanguage?: any
  serverUrl: string
  subServerUrl: string
  ids: IIds
}

export interface ICommentComposite {
  id: number
  fork: number
  isActive: boolean
  postkeyStatus: number
  isDefaultPostTarget: boolean
  isThreadKeyRequired: boolean
  layerIndex: number
  label: string
}

export interface ITag {
  id: string
  name: string
  isCategory: boolean
  isCategoryCandidate: boolean
  isDictionaryExists: boolean
  isLocked: boolean
}

export interface IPlaylist {
  watchId: string
  referer?: any
  parameter?: any
}

export interface IOwner {
  id: string
  nickname: string
  iconURL: string
  nicoliveInfo?: any
  channelInfo?: any
  isUserVideoPublic: boolean
  isUserMyVideoPublic: boolean
  isUserOpenListPublic: boolean
}

export interface IViewer {
  id: number
  nickname: string
  prefecture: number
  sex: number
  age: number
  isPremium: boolean
  isPrivileged: boolean
  isPostLocked: boolean
  isHtrzm: boolean
  isTwitterConnection: boolean
  nicosid: string
}

export interface IMainCommunity {
  id: number
  name: string
  threadType?: any
  globalId?: any
}

export interface IAd {
  vastMetaData?: any
}

export interface ITagRelatedMarquee {
  id: string
  url: string
  title: string
}

export interface ITagRelatedBanner {
  id: string
  url: string
  title: string
  thumbnailURL: string
}

export interface ILead {
  tagRelatedMarquee: ITagRelatedMarquee
  tagRelatedBanner: ITagRelatedBanner
  nicosdkApplicationBanner?: any
  videoEndBannerIn?: any
  videoEndOverlay?: any
}

export interface IOwnerNGList {
  source: string
  destination: string
}

export interface IContext {
  playFrom?: any
  initialPlaybackPosition?: any
  initialPlaybackType?: any
  playLength?: any
  returnId?: any
  returnTo?: any
  returnMsg?: any
  watchId: string
  isNoMovie?: boolean
  isNoRelatedVideo?: boolean
  isDownloadCompleteWait?: boolean
  isNoNicotic?: boolean
  isNeedPayment: boolean
  isAdultRatingNG: boolean
  isPlayable?: boolean
  isTranslatable: boolean
  isTagUneditable: boolean
  isVideoOwner: boolean
  isThreadOwner: boolean
  isOwnerThreadEditable?: boolean
  useChecklistCache?: any
  isDisabledMarquee?: boolean
  isDictionaryDisplayable: boolean
  isDefaultCommentInvisible: boolean
  accessFrom?: any
  csrfToken: string
  translationVersionJsonUpdateTime: number
  userkey: string
  watchAuthKey: string
  watchTrackId: string
  watchPageServerTime: number
  isAuthenticationRequired: boolean
  isPeakTime: boolean
  ngRevision: number
  categoryName: string
  categoryKey: string
  categoryGroupName: string
  categoryGroupKey: string
  yesterdayRank?: any
  highestRank: number
  isMyMemory: boolean
  ownerNGList: IOwnerNGList[]
  linkedChannelVideos?: any
  isAllowEmbedPlayer: boolean
}

export interface IItem {
  id: string
  title: string
  thumbnailURL: string
  point: number
  isHigh: boolean
  elapsedTimeM: number
  communityId: string
  communityName: string
}

export interface ILiveTopics {
  items: IItem[]
}

export interface IWatchData {
  video: IVideo
  player: IPlayer
  thread: IThread
  commentComposite: ICommentComposite[]
  tags: ITag[]
  playlist: IPlaylist
  owner: IOwner
  viewer: IViewer
  community?: any
  mainCommunity: IMainCommunity
  channel?: any
  ad: IAd
  lead: ILead
  maintenance?: any
  context: IContext
  liveTopics: ILiveTopics
}

export interface IThumbinfo {
  videoID: string
  title: string
  description: string
  watchURL: string
  movieType: string
}
