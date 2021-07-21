import Link from 'next/link';
import { Avatar } from '../Avatar';


export type SpeakerProps = {
  username: string,
  avatarUrl: string,
  id: number
}

export const Speaker: React.FC<SpeakerProps> = ({username,avatarUrl, id }) => {

  return <div className="d-i-flex flex-column align-items-center mr-30 mb-30">

    <Link href={`/profile/${id}`}>
        <a>
        <Avatar src={avatarUrl} height="90px" width="90px" />

        <div className="mt-10">
          <b>{username}</b>
        </div>
        </a>
    </Link>
    
  </div>
}