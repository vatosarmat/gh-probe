import ghLangs from './gh-langs.json'

type LangString = keyof typeof ghLangs

function isLangString(str: string | undefined | null): str is LangString {
  return !!str && str in ghLangs
}

export default function getLangColor(maybeLang: string | undefined | null): string {
  return isLangString(maybeLang) ? ghLangs[maybeLang].color || 'black' : 'black'
}
