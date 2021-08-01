const drinkAudio: HTMLAudioElement = document.querySelector('#drink-audio');

export enum AUDIOS {
  DRINK = 'drink',
};

const AUDIO_ELEMENTS: Record<AUDIOS, HTMLAudioElement> = {
  [AUDIOS.DRINK]: drinkAudio,
};

export const playAudio = (audioKey: AUDIOS) => {
  const audioElement = AUDIO_ELEMENTS[audioKey];
  if (audioElement) {
    try {
      audioElement.play();
    } catch (error) {
      console.error('fail to play audio ', audioKey, error);
    }
  } else {
    console.error('fail to play audio ', audioKey, new Error('can not find audio element.'));
  }
};

// TODO: stop audio
