import { app, imaginePost } from '@/shared/firebase';
import { $userId } from '@/shared/model';
import { Message } from 'grammy/types';
import {
  ArrowUpRightFromSquare,
  CircleQuestion,
  Copy,
  Paperclip,
  GearBranches,
  MagicWand,
  CircleXmark,
} from '@gravity-ui/icons';
import {
  Card,
  Text,
  Tooltip,
  Icon,
  Link,
  Loader,
  TextInput,
  Button,
  Label,
  TextArea,
  Checkbox,
} from '@gravity-ui/uikit';
import { useUnit } from 'effector-react';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useRef, useState, useEffect } from 'react';
import { navigateTo } from '../model';
import BackButton from '@/components/BackButton';
import { LOCAL_STORAGE_POST_DRAFT_KEY_PREFIX } from '../constants';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';

const CraftScreen: React.FC = () => {
  const userId = useUnit($userId);
  const [config, setConfig] = useState<{
    appTitle: string;
    appUrl: string;
    message: string;
    community?: string;
    isDraft: boolean;
    imageUrl?: string;
    imageFileId?: string;
    imageFileUniqueId?: string;
    context_prompt?: string;
    audience?: string;
    call_to_action?: string;
  }>({
    appTitle: 'vSelf Game',
    appUrl: '',
    imageUrl: '',
    message: '',
    community: '',
    isDraft: true,
  });

  const [imgIsLoading, setImgIsLoading] = useState<boolean>(false);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [postLink, setPostLink] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');
  const [threadId, setThreadId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const p = window.localStorage.getItem(
      `${LOCAL_STORAGE_POST_DRAFT_KEY_PREFIX}_${userId}`
    );
    if (p) setConfig(JSON.parse(p));
    console.log('restored config:', p);
  }, []);

  const onClickCopy = () => {
    navigator.clipboard.writeText(config.appUrl);
  };

  const onClickShare = () => {
    const url = encodeURI(config.appUrl);
    const text = encodeURI('Check out this awesome mini app! 🚀');
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const srcLocal = URL.createObjectURL(file);
      setImgIsLoading(true);

      const storage = getStorage(app);
      const storageRef = ref(storage, `post-images/${file.name}`);

      try {
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        setConfig({ ...config, imageUrl: downloadUrl, isDraft: true });
      } catch (error: any) {
        console.error('Error uploading image:', error);
        setErrorMessage(error.toString());
      } finally {
        setImgIsLoading(false);
      }
    }
  };

  const saveDraft = async () => {
    const p = window.localStorage.setItem(
      `${LOCAL_STORAGE_POST_DRAFT_KEY_PREFIX}_${userId}`,
      JSON.stringify(config)
    );
  };

  const sendPost = async (chat: string | undefined = undefined) => {
    const payload = {
      postData: {
        userId,
        ...config,
      },
    };

    console.log(payload);

    if (config.isDraft) {
      // Test post and update config
      const result = await fetch(`/api/postMessage`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const data = await result.json();

      if (data.status === 'success') {
        const message: Message = data.message;
        setConfig({
          ...config,
          isDraft: false,
          imageFileId: message?.photo?.[1].file_id,
          imageFileUniqueId: message?.photo?.[1].file_unique_id,
        });

        // add published post to db TODO
        setPostLink(data.link);
      }
    } else {
      // Publish post
      console.log('Publishing...');

      payload.postData.userId = chat ?? null;

      const result = await fetch(`/api/postMessage`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const data = await result.json();

      if (data.status === 'success') {
        const message: Message = data.message;
        setPostLink(data.link);
      }
    }
  };

  return (
    <>
      <BackButton onClick={() => navigateTo('selector')}></BackButton>
      <Text as='h1' variant='header-2' className='mt-4 font-bold text-left'>
        STEP 2
      </Text>
      <div className='flex flex-row gap-1 items-center'>
        <Text
          as='div'
          variant='header-1'
          className='flex font-semibold text-left'
        >
          CRAFT YOUR POST
        </Text>
        <Tooltip
          content={
            <div>
              <div className='p-1'>
                In this step, you can create a Telegram post for your community.
                See the example below.
              </div>
              <img
                className='mx-auto w-full'
                src='/example_craft.png'
                width={300}
              ></img>
            </div>
          }
        >
          <Icon data={CircleQuestion}></Icon>
        </Tooltip>
      </div>
      <Card className='p-4 flex-row gap-1 items-start'>
        <div className='flex-row gap-1 items-start'>
          <div>
            Here you can customise and craft a Telegram post for further
            distribution using our templates and help of AI assistant.
          </div>
        </div>
      </Card>

      <form className='flex flex-col gap-1'>
        <div className='flex flex-row items-center gap-1 my-1'>
          <Text
            as='h3'
            variant='subheader-1'
            className='font-semibold text-left '
          >
            Describe Campaign context for AI
          </Text>
          <Tooltip
            content={
              <>
                Describe target audience and services you promote, specify call
                to action.
              </>
            }
          >
            <Icon data={CircleQuestion}></Icon>
          </Tooltip>
        </div>
        <Card>
          <TextArea
            name='context'
            minRows={2}
            value={config.context_prompt}
            placeholder='Describe Campaign context for AI (product/service)'
            onChange={(e) => {
              setConfig({
                ...config,
                context_prompt: e.currentTarget.value,
                isDraft: true,
              });
            }}
          ></TextArea>
        </Card>
        <Card>
          <TextArea
            name='audience'
            minRows={2}
            value={config.audience}
            placeholder='Describe Target Audience'
            onChange={(e) => {
              setConfig({
                ...config,
                audience: e.currentTarget.value,
                isDraft: true,
              });
            }}
          ></TextArea>
        </Card>
        <Card>
          <TextArea
            name='call_to_action'
            minRows={2}
            value={config.call_to_action}
            placeholder='Specify Call To Action'
            onChange={(e) => {
              setConfig({
                ...config,
                call_to_action: e.currentTarget.value,
                isDraft: true,
              });
            }}
          ></TextArea>
        </Card>

        <div className='flex flex-row items-center gap-1 my-1'>
          <Text
            as='h3'
            variant='subheader-1'
            className='font-semibold text-left '
          >
            Upload Image
          </Text>
          <Tooltip
            content={
              <>
                If you want your post to contain visuals, you can upload a file
                from your computer.
              </>
            }
          >
            <Icon data={CircleQuestion}></Icon>
          </Tooltip>
          <Button
            onClick={() => {
              inputFileRef.current?.click();
            }}
          >
            <Icon data={Paperclip}></Icon>
          </Button>
          <Button
            onClick={() => {
              setConfig({ ...config, imageUrl: '', isDraft: true });
              setImgIsLoading(false);
            }}
          >
            <Icon data={CircleXmark}></Icon>
          </Button>
        </div>
        <div className='flex flex-row items-start gap-1'>
          <TextInput
            style={{ display: 'none' }}
            disabled={true}
            name='image_url'
            value={config.imageUrl}
          ></TextInput>
          <input
            type='file'
            ref={inputFileRef}
            name='file'
            className='hidden w-0'
            accept='image/png, image/gif, image/jpeg'
            onChange={handleImageChange}
          />
        </div>
        <Card
          className={config.imageUrl === '' || imgIsLoading ? 'hidden' : ''}
        >
          <img
            className={imgIsLoading ? 'hidden' : 'm-auto w-full p-2'}
            width={300}
            src={`${config.imageUrl}`}
            onLoad={() => {
              setImgIsLoading(false);
            }}
          />
        </Card>

        {imgIsLoading && <Loader className='m-4'></Loader>}

        <div className='flex flex-row items-center gap-1'>
          <Text
            as='h3'
            variant='subheader-1'
            className='font-semibold text-left'
          >
            Post Contents
          </Text>
          <Tooltip
            content={
              <>
                Here, you edit the content of your post’s main message (we
                support HTML tags as well).
              </>
            }
          >
            <Icon data={CircleQuestion}></Icon>
          </Tooltip>
          <Tooltip
            content={
              <>
                Here, you generate suggestion for your activation message
                prompting Gemini AI.
              </>
            }
          >
            <Button
              onClick={() => {
                if (config.context_prompt) {
                  imaginePost(
                    config.context_prompt,
                    config.audience ?? '',
                    config.call_to_action ?? ''
                  ).then((text) =>
                    setConfig({ ...config, message: text, isDraft: true })
                  );
                }
              }}
            >
              <Icon data={MagicWand}></Icon>
            </Button>
          </Tooltip>
          <Button
            onClick={() => {
              setConfig({ ...config, message: '', isDraft: true });
            }}
          >
            <Icon data={CircleXmark}></Icon>
          </Button>
        </div>
        <Card>
          <TextArea
            name='message'
            minRows={4}
            value={config.message}
            onChange={(e) => {
              setConfig({
                ...config,
                message: e.currentTarget.value,
                isDraft: true,
              });
            }}
          ></TextArea>
        </Card>
      </form>

      <div className='flex flex-row gap-2 justify-between items-center mt-2 mb-2'>
        <Text as='h3' variant='subheader-1' className='font-semibold text-left'>
          To save current post draft press 'Save Draft'. To get a preview of the
          activation post in the{' '}
          <Link href='https://t.me/vself_bot'>vSelf Bot thread</Link> and unlock
          publishing flow, click 'Test Post' button {'=>'}
        </Text>
        <div className='flex flex-col gap-2'>
          <Button view='action' className='' onClick={saveDraft}>
            Save Draft
          </Button>
          <Button view='action' className='' onClick={() => sendPost()}>
            Test Post
          </Button>
        </div>
      </div>

      {!config.isDraft && (
        <>
          <Card className='p-2'>
            Alternatively, you can use the current configuration to post to the
            community channel (make sure the{' '}
            <Link href='https://t.me/vself_bot'>vSelf Bot</Link> is in the group
            and has enought rights to post)
          </Card>

          <div className='flex flex-row justify-between mt-2 gap-1'>
            <TextInput
              className=''
              placeholder='@vbrand_test'
              value={chatId}
              onChange={(e) => {
                setChatId(e.currentTarget.value);
              }}
            ></TextInput>
            <Button
              view='action'
              onClick={async () => {
                await sendPost(chatId);
                // Get list of users for now
                // const db = getFirestore(app);
                // const usersRef = collection(db, "users");
                // const q = query(usersRef, where("allowsWriteToPm", "==", true));
                // const querySnapshot = await getDocs(q);

                // let audience: { id: string; name: string; score: number }[] =
                //   querySnapshot.docs.map((doc) => ({
                //     id: doc.id,
                //     name: doc.data().username || doc.data().id,
                //     score: doc.data().mana || 0,
                //   }));

                // broadcast todo
                // console.log(audience);
                // audience = [{ id: "135379933", name: "ilerik", score: 0 }];

                // audience.forEach(async (user) => {
                //   console.log("User:", user.id);
                //   await sendPost(user.id);
                //   console.log("Published.");
                // });
              }}
            >
              Publish
            </Button>
          </div>

          <div className='flex flex-row items-center justify-between py-2 gap-1'>
            <Checkbox
              size='l'
              className='m-auto'
              checked={threadId !== undefined}
              onChange={() => {
                if (threadId) {
                  setThreadId(undefined);
                } else {
                  setThreadId('1');
                }
              }}
            ></Checkbox>
            <Text>Thread</Text>
            <TextInput
              className=''
              placeholder='1'
              value={threadId}
              onChange={(e) => {
                setThreadId(e.currentTarget.value);
              }}
            ></TextInput>
          </div>
        </>
      )}

      {postLink && (
        <Card className='py-1 px-2'>
          Direct link to the published <Link href={`${postLink}`}>message</Link>
          .
        </Card>
      )}

      {errorMessage && (
        <Label
          className='w-full h-20 p-2'
          onCopy={async (text) => {
            await navigator.clipboard.writeText(text);
          }}
          type='copy'
          theme='danger'
        >
          <Text className='p-1 text-left'>{errorMessage}</Text>
        </Label>
      )}
    </>
  );
};

export default CraftScreen;
