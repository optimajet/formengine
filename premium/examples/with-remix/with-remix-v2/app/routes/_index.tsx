import type {MetaFunction} from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    {title: 'FormEngine with Remix'},
    {name: 'description', content: 'Welcome to FormEngine!'},
  ]
}

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to <span className="sr-only">FormEngine</span>
          </h1>
          <div className="h-[144px] w-[434px]">
            <img
              src="/logo-light.svg"
              alt="Designer"
              className="block w-full dark:hidden"
            />
            <img
              src="/logo-dark.svg"
              alt="Viewer"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <nav>
          <ul className="flex flex-row gap-9 text-3xl color-">
            <li>
              <a href="/builder" className="font-size-[1.5em]">Designer</a>
            </li>
            <li>
              <a href="/viewer" className="font-size-[1.5em]">Viewer</a>
            </li>
          </ul>
        </nav>
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <p className="leading-6 text-gray-700 dark:text-gray-200">
            What&apos;s next?
          </p>
          <ul>
            {resources.map(({href, text, icon}) => (
              <li key={href}>
                <a
                  className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {icon}
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

const resources = [
  {
    href: 'https://formengine.io/documentation/',
    text: 'Documentation',
    icon: (
      <svg fill="none" viewBox="0 0 16 16" width="24" height="20" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z"
          clipRule="evenodd" fill="#666" fillRule="evenodd"/>
      </svg>
    ),
  },
  {
    href: 'https://formengine.io/documentation/usage-with-remix',
    text: 'With Remix',
    icon: (
      <svg fill="none" width="24" height="20" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z"
          clipRule="evenodd" fill="#666" fillRule="evenodd"/>
      </svg>
    ),
  },
  {
    href: 'https://formengine.io/pricing',
    text: 'FormEngine',
    icon: (
      <svg fill="none" width="24" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <g clipPath="url(#a)">
          <path fillRule="evenodd" clipRule="evenodd"
                d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1"
                fill="#666"/>
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h16v16H0z"/>
          </clipPath>
        </defs>
      </svg>
    ),
  },
]
