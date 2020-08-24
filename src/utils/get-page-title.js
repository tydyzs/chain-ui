import defaultSettings from '@/settings'

const title = defaultSettings.title || '统一授信系统'

export default function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
