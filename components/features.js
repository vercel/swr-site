import { useRouter } from 'next/router'

import styles from './features.module.css'

const Feature = ({ text, icon }) => (
  <div className={styles.feature}>
    {icon}
    <h4>{text}</h4>
  </div>
)

const TITLE_WITH_TRANSLATIONS = {
  'en-US': 'React Hooks library for data fetching',
  'es-ES': 'Biblioteca React Hooks para la obtención de datos',
  'zh-CN': '用于数据请求的 React Hooks 库',
  'ja': 'データ取得のための React Hooks ライブラリ',
  'ko': '데이터 가져오기를 위한 React Hooks 라이브러리',
}

export default () => {
  const {locale} = useRouter()
  return (
    <div>
      <p className="text-lg mb-2 text-gray-600 md:text-xl">{TITLE_WITH_TRANSLATIONS[locale]}</p>
      <div className={styles.features}>
        <Feature
          text="Lightweight"
          icon={
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              shapeRendering="geometricPrecision"
              style={{ color: 'var(--geist-foreground)' }}
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
            </svg>
          }
        />
        <Feature
          text="Backend Agnostic"
          icon={
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              shapeRendering="geometricPrecision"
            >
              <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" />
              <path d="M8 16h.01" />
              <path d="M8 20h.01" />
              <path d="M12 18h.01" />
              <path d="M12 22h.01" />
              <path d="M16 16h.01" />
              <path d="M16 20h.01" />
            </svg>
          }
        />
        <Feature
          text="Realtime"
          icon={
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              shapeRendering="geometricPrecision"
              viewBox="0 0 24 24"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
          }
        />
        <Feature
          text="Jamstack Oriented"
          icon={
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              shapeRendering="geometricPrecision"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          }
        />
        <Feature
          text="TypeScript Ready"
          icon={
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              shapeRendering="geometricPrecision"
              viewBox="0 0 24 24"
            >
              <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
              <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"></path>
            </svg>
          }
        />
        <Feature
          text="Remote + Local"
          icon={
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              shapeRendering="geometricPrecision"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="2"></circle>
              <path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14"></path>
            </svg>
          }
        />
      </div>
    </div>
  )
}
