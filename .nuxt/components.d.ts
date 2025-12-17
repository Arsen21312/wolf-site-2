
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T


export const GamesFiveSeconds: typeof import("../src/components/games/FiveSeconds/FiveSeconds.vue")['default']
export const GamesNeverHaveIEver: typeof import("../src/components/games/NeverHaveIEver/NeverHaveIEver.vue")['default']
export const GamesOracleGame: typeof import("../src/components/games/Oracle/OracleGame.vue")['default']
export const GamesTrueOrFalse: typeof import("../src/components/games/TrueOrFalse/TrueOrFalse.vue")['default']
export const GamesTruthOrDareGame: typeof import("../src/components/games/TruthOrDare/TruthOrDareGame.vue")['default']
export const GamesTruthOrDareQuestions: typeof import("../src/components/games/TruthOrDare/questions")['default']
export const NavigationBubbleMenu: typeof import("../src/components/navigation/BubbleMenu.vue")['default']
export const NavigationMainFooter: typeof import("../src/components/navigation/MainFooter.vue")['default']
export const NavigationMainHeader: typeof import("../src/components/navigation/MainHeader.vue")['default']
export const UiGlobalSnow: typeof import("../src/components/ui/GlobalSnow.vue")['default']
export const UiPixelTransition: typeof import("../src/components/ui/PixelTransition.vue")['default']
export const UiRotatingText: typeof import("../src/components/ui/RotatingText.vue")['default']
export const UiSocialPopup: typeof import("../src/components/ui/SocialPopup.vue")['default']
export const UiTextType: typeof import("../src/components/ui/TextType.vue")['default']
export const UiWolfAvatar: typeof import("../src/components/ui/WolfAvatar.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyGamesFiveSeconds: LazyComponent<typeof import("../src/components/games/FiveSeconds/FiveSeconds.vue")['default']>
export const LazyGamesNeverHaveIEver: LazyComponent<typeof import("../src/components/games/NeverHaveIEver/NeverHaveIEver.vue")['default']>
export const LazyGamesOracleGame: LazyComponent<typeof import("../src/components/games/Oracle/OracleGame.vue")['default']>
export const LazyGamesTrueOrFalse: LazyComponent<typeof import("../src/components/games/TrueOrFalse/TrueOrFalse.vue")['default']>
export const LazyGamesTruthOrDareGame: LazyComponent<typeof import("../src/components/games/TruthOrDare/TruthOrDareGame.vue")['default']>
export const LazyGamesTruthOrDareQuestions: LazyComponent<typeof import("../src/components/games/TruthOrDare/questions")['default']>
export const LazyNavigationBubbleMenu: LazyComponent<typeof import("../src/components/navigation/BubbleMenu.vue")['default']>
export const LazyNavigationMainFooter: LazyComponent<typeof import("../src/components/navigation/MainFooter.vue")['default']>
export const LazyNavigationMainHeader: LazyComponent<typeof import("../src/components/navigation/MainHeader.vue")['default']>
export const LazyUiGlobalSnow: LazyComponent<typeof import("../src/components/ui/GlobalSnow.vue")['default']>
export const LazyUiPixelTransition: LazyComponent<typeof import("../src/components/ui/PixelTransition.vue")['default']>
export const LazyUiRotatingText: LazyComponent<typeof import("../src/components/ui/RotatingText.vue")['default']>
export const LazyUiSocialPopup: LazyComponent<typeof import("../src/components/ui/SocialPopup.vue")['default']>
export const LazyUiTextType: LazyComponent<typeof import("../src/components/ui/TextType.vue")['default']>
export const LazyUiWolfAvatar: LazyComponent<typeof import("../src/components/ui/WolfAvatar.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
