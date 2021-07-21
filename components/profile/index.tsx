import clsx from 'clsx';
import Link from 'next/link';
import { Avatar } from '../Avatar';
import BackButton from '../BackButton/BackButton';
import { Button } from '../Button';
import styles from './Profile.module.scss';

interface ProfileProps {
  fullname: string
  username: string
  avatarUrl: string
  about: string
}

 const Profile: React.FC<ProfileProps> = ({ fullname, username, avatarUrl, about }) => {
  return (
    <>    
      <BackButton title="Back" href="/rooms"/>
      <div className='d-flex align-items-center'>
        <div className='d-flex align-items-center'>
          <Avatar src={avatarUrl} width="100px" height="100px"></Avatar>
          <div className='d-flex flex-column ml-30 mr-20' >
            <h2 className='mt-0 mb-0'>{fullname}</h2>
            <h3 className={clsx(styles.username,'mt-0 mb-0')}>@{username}</h3>
          </div>
        </div>
        <Button className={styles.followButton} color="blue">Follow</Button>
      </div>
      <p className={styles.about}>{about}</p>
    
    </>
  );
};

export default Profile