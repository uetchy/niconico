export interface SmileInfo {
  url: string
  isSlowLine: boolean
  currentQualityId: string
  qualityIds: string[]
}

export interface Video {
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
  smileInfo: SmileInfo
}

export interface Player {
  playerInfoXMLUpdateTIme: number
  isContinuous: boolean
}

export interface Ids {
  default: string
  nicos?: any
  community?: any
}

export interface Thread {
  commentCount: number
  hasOwnerThread?: any
  mymemoryLanguage?: any
  serverUrl: string
  subServerUrl: string
  ids: Ids
}

export interface CommentComposite {
  id: number
  fork: number
  isActive: boolean
  postkeyStatus: number
  isDefaultPostTarget: boolean
  isThreadKeyRequired: boolean
  layerIndex: number
  label: string
}

export interface Tag {
  id: string
  name: string
  isCategory: boolean
  isCategoryCandidate: boolean
  isDictionaryExists: boolean
  isLocked: boolean
}

export interface Playlist {
  watchId: string
  referer?: any
  parameter?: any
}

export interface Owner {
  id: string
  nickname: string
  iconURL: string
  nicoliveInfo?: any
  channelInfo?: any
  isUserVideoPublic: boolean
  isUserMyVideoPublic: boolean
  isUserOpenListPublic: boolean
}

export interface Viewer {
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

export interface MainCommunity {
  id: number
  name: string
  threadType?: any
  globalId?: any
}

export interface Ad {
  vastMetaData?: any
}

export interface TagRelatedMarquee {
  id: string
  url: string
  title: string
}

export interface TagRelatedBanner {
  id: string
  url: string
  title: string
  thumbnailURL: string
}

export interface Lead {
  tagRelatedMarquee: TagRelatedMarquee
  tagRelatedBanner: TagRelatedBanner
  nicosdkApplicationBanner?: any
  videoEndBannerIn?: any
  videoEndOverlay?: any
}

export interface OwnerNGList {
  source: string
  destination: string
}

export interface Context {
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
  ownerNGList: OwnerNGList[]
  linkedChannelVideos?: any
  isAllowEmbedPlayer: boolean
}

export interface Item {
  id: string
  title: string
  thumbnailURL: string
  point: number
  isHigh: boolean
  elapsedTimeM: number
  communityId: string
  communityName: string
}

export interface LiveTopics {
  items: Item[]
}

export interface WatchData {
  video: Video
  player: Player
  thread: Thread
  commentComposite: CommentComposite[]
  tags: Tag[]
  playlist: Playlist
  owner: Owner
  viewer: Viewer
  community?: any
  mainCommunity: MainCommunity
  channel?: any
  ad: Ad
  lead: Lead
  maintenance?: any
  context: Context
  liveTopics: LiveTopics
}

export interface Thumbinfo {
  videoID: string
  title: string
  description: string
  watchURL: string
  movieType: string
}
