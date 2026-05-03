export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
}

export function GithubIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || "24"}
      height={props.size || "24"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.1a5.8 5.8 0 0 0-1.6-4.03 5.5 5.5 0 0 0-.15-3.97s-1.28-.4-4 1.4a13.7 13.7 0 0 0-7 0c-2.72-1.8-4-1.4-4-1.4a5.5 5.5 0 0 0-.15 3.97A5.8 5.8 0 0 0 3 7.87c0 5.68 3.35 6.7 6.5 7.1a4.8 4.8 0 0 0-1 3.03v4" />
      <path d="M9 20c-5 1.5-5-2.5-7-3" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || "24"}
      height={props.size || "24"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
