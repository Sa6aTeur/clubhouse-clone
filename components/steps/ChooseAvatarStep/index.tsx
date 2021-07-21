import React from 'react';
import clsx from 'clsx';
import { WhiteBlock } from '../../WhiteBlock';
import { Button } from '../../Button';
import { StepInfo } from '../../StepInfo';
import { Avatar } from '../../Avatar';
import styles from './ChooseAvatarStep.module.scss';
import { MainContext } from '../../../pages';
import { Axios } from '../../../core/axios';



const uploadFile = async (file: File): Promise<{url: string}>=>{
  const formData = new FormData()
  formData.append('photo',file)

  const {data} = await Axios({
    url: '/upload',
    method: 'POST',
    data: formData,
    headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  },

  })

  return data
}

export const ChooseAvatarStep: React.FC = () => {
  const {onNextStep,setFieldValue,userData} = React.useContext(MainContext)
  const avatarLetters = userData.fullname.split(' ').map(s => s[0]).join(' ')
  const [avatarUrl, setAvatarUrl] = React.useState<string>('');


  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const handleChangeImage = async (event) => {
    const target = event.target ;
    const file = event.target.files[0];
    if (file) { 
      const data =  await uploadFile(file)
      setAvatarUrl(data.url);
      setFieldValue('avatarUrl',data.url)
      target.value = ''
    }
  };

  React.useEffect(() => {
    if (inputFileRef.current) {
      inputFileRef.current.addEventListener('change', handleChangeImage);
    }
    
  }, []);
  
  return (
    <div className={styles.block}>
      <StepInfo
        icon="/static/celebration.png"
        title={`Okay, ${userData?.fullname}!`}
        description="How’s this photo?"
      />
      <WhiteBlock className={clsx('m-auto mt-40', styles.whiteBlock)}>
        <div className={styles.avatar}>
          <Avatar src={avatarUrl} letters={avatarLetters} width="120px" height="120px"  />
        </div>
        <div className="mb-30">
          <label htmlFor="image" className="link cup">
            Choose a different photo
          </label>
        </div>
        <input id="image" ref={inputFileRef} type="file" hidden />
        <Button onClick={onNextStep} >
          Next
          <img className="d-ib ml-10" src="/static/arrow.svg" />
        </Button>
      </WhiteBlock>
    </div>
  );
};
