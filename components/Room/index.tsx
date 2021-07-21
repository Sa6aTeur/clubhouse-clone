import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import Peer from 'simple-peer';
import { useRouter } from 'next/router';
import { Button } from '../Button';
import { Speaker } from '../Speaker';

import styles from './Room.module.scss';
import { selectUser } from '../../redux/selectors';
import { useSelector } from 'react-redux';
import { UserData } from '../../pages';
import { useSocket } from '../../hooks/useSocket';

interface RoomProps {
  title: string;
}

let peers = [];

export const Room: React.FC<RoomProps> = ({ title }) => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const [users, setUsers] = React.useState<UserData[]>([]);
  const roomId = router.query.id;
  const socket = useSocket();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          socket.emit('CLIENT@ROOM:JOIN', {
            user,
            roomId,
          });

          socket.on('SERVER@ROOM:JOIN', (allUsers: UserData[]) => {
            console.log(allUsers);

            setUsers(allUsers);

            allUsers.forEach((speaker) => {
              if (user.id !== speaker.id && !peers.find((obj) => obj.id !== speaker.id)) {
                const incomePeer = new Peer({
                  initiator: true,
                  trickle: false,
                  stream,
                });

                incomePeer.on('signal', (signal) => {

                  socket.emit('CLIENT@ROOM:CALL', {
                    targetUserId: speaker.id,
                    callerUserId: user.id,
                    roomId,
                    signal,
                  });
                  peers.push({
                    peer: incomePeer,
                    id: speaker.id,
                  });
                });

                socket.on(
                  'SERVER@ROOM:CALL',
                  ({ targetUserId, callerUserId, signal: callerSignal }) => {

                    const outcomePeer = new Peer({
                      initiator: false,
                      trickle: false,
                      stream,
                    });

                    outcomePeer.signal(callerSignal);

                    outcomePeer
                     
                      .on('signal', (outSignal) => {
                  
                        socket.emit('CLIENT@ROOM:ANSWER', {
                          targetUserId: callerUserId,
                          callerUserId: targetUserId,
                          roomId,
                          signal: outSignal,
                        });
                      })


                      .on('stream', (stream) => {
                        document.querySelector('audio').srcObject = stream;
                        document.querySelector('audio').play();
                      });
                  },
                );

                socket.on('SERVER@ROOM:ANSWER', ({ callerUserId, signal }) => {
                  const obj = peers.find((obj) => Number(obj.id) === Number(callerUserId));
                  if (obj) {
                    obj.peer.signal(signal);
                  }
                });
              }
            });
          });

          socket.on('SERVER@ROOM:LEAVE', (leaveUser: UserData) => {
            console.log(leaveUser.id, peers);
            setUsers((prev) =>
              prev.filter((prevUser) => {
                const peerUser = peers.find((obj) => Number(obj.id) === Number(leaveUser.id));
                if (peerUser) {
                  peerUser.peer.destroy();
                }
                return prevUser.id !== leaveUser.id;
              }),
            );
          });
        })
        .catch(() => {
          console.error('Доступ к микрофону запрещен');
        });
    }

    return () => {
      peers.forEach((obj) => {
        obj.peer.destroy();
      });
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <audio controls className="d-n"/>
      <div className="d-flex align-items-center justify-content-between">
        <h2>{title}</h2>
        <div className={clsx('d-flex align-items-center', styles.actionButtons)}>
          <Link href="/rooms">
            <a>
              <Button color="gray" className={styles.leaveButton}>
                <img width={18} height={18} src="/static/peace.png" alt="Hand black" />
                Leave quietly
              </Button>
            </a>
          </Link>
        </div>
      </div>

      <div className="users">
        {users.map((obj) => (
          <Speaker key={obj.fullname} {...obj} />
        ))}
      </div>
    </div>
  );
};
