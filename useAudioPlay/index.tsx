import fsUtils from "@/utils/fsUtils";
import {useEffect, useState} from "react";

type useAudioPlayProps = {
  defaultAutoplay?: boolean,
  loop?: boolean,
  defaultMuted?: boolean,
  src: string[] | string,
  onMutedChange?: (muted: boolean) => void,
  onStartChange?: () => void,
  onChange?: () => void,
}

const acquireMusic = (src: string[] | string) => {
  if (typeof (src) === "object") {
    return [...src];
  } else if (typeof (src) === "string") {
    return [src];
  }
  return [];
}

const useAudioPlay = (
  {
    defaultAutoplay = false,
    loop = false,
    defaultMuted = false,
    src,
    onMutedChange,
    onStartChange,
    onChange,
  }: useAudioPlayProps) => {
  let musicList = acquireMusic(src);
  const [isPlay, setIsPlay] = useState<boolean>(defaultAutoplay);
  const [i, setI] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(defaultMuted);
  const [audio] = useState<HTMLAudioElement>(new Audio());

  const playAudio = () => {
    setIsPlay(true);
    audio?.play().catch(error=>{
      console.log('播放异常')
    });
  }

  const pauseAudio = () => {
    audio?.pause();
  }

  const nextAudio = () => {
    setI(i => i + 1);
  }

  const stopAudio = () => {
    setIsPlay(false);
    setI(0);
    audio?.pause();
  }


  const setMutedAudio = () => {
    setMuted(!muted);
  }

  const setAudioVolume = (volume:number) => {
    audio.volume = volume;
  }

  const audioSrc = (uuid: string,isLocal?: boolean) => {
    if (onStartChange) {
      onStartChange();
    }
    if(!isLocal){
      audio.src = `${fsUtils.getViewFileAddress(uuid)}`;
    }else {
      console.log(uuid)
      audio.src = uuid;
    }
    playAudio();
  }



  useEffect(()=>{
    if (isPlay && onStartChange) {
      onStartChange();
    }
  },[isPlay])

  useEffect(() => {
    audio.preload = "auto";
    audio.addEventListener('ended', nextAudio, false);
  }, []);

  useEffect(() => {
    if (audio) {
      audio.muted = muted;
      if (onMutedChange) {
        onMutedChange(muted);
      }
    }
  }, [muted]);

  useEffect(()=>{
    return () => {
      pauseAudio();
    }
  },[])

  useEffect(() => {
    if (musicList.length && i < musicList.length ) {
      pauseAudio();
      console.log(musicList[i])
      audio.src = `${fsUtils.getViewFileAddress(musicList[i])}`;
      if (isPlay) {
        playAudio();
      }
    } else {
      if (loop) {
        setI(0);
      }else {
        audio.removeEventListener('ended', nextAudio, false)
        if (onChange) {
          audio.addEventListener('ended', onChange, false);
        }
      }
    }
  }, [i,isPlay])

  return {playAudio, pauseAudio, nextAudio, stopAudio,audioSrc, muted, setMutedAudio, setAudioVolume, isPlay };
}

export default useAudioPlay;
