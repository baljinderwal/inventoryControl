import React, { useState, useEffect, useCallback, useRef } from 'react';
import Button from '@mui/material/Button';
import MicIcon from '@mui/icons-material/Mic';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const GuidedVoiceAdd = ({ fields, onUpdate, onComplete, start }) => {
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, speaking, listening, paused
  const [recognition, setRecognition] = useState(null);
  const resultHandled = useRef(false);

  useEffect(() => {
    if (start) {
      handleStart();
    }
  }, [start]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      setRecognition(recognitionInstance);
    }
  }, []);

  const speak = (text, onEnd) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported.');
      return;
    }
    setStatus('speaking');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = useCallback(() => {
    if (recognition) {
      setStatus('listening');
      recognition.start();
    }
  }, [recognition]);

  const processField = useCallback(() => {
    if (currentFieldIndex >= fields.length) {
      setStatus('idle');
      if (onComplete) onComplete();
      return;
    }
    const currentField = fields[currentFieldIndex];
    speak(`Please say the ${currentField.label}`, startListening);
  }, [currentFieldIndex, fields, onComplete, startListening]);

  useEffect(() => {
    if (status === 'paused' || status === 'idle' || !recognition) return;

    recognition.onstart = () => {
      resultHandled.current = false;
    };

    recognition.onresult = (event) => {
      resultHandled.current = true;
      const transcript = event.results[0][0].transcript;
      const currentField = fields[currentFieldIndex];
      onUpdate(currentField.name, transcript);

      // Move to the next field
      const nextIndex = currentFieldIndex + 1;
      if (nextIndex < fields.length) {
        setCurrentFieldIndex(nextIndex);
      } else {
        // This was the last field
        if (onComplete) onComplete();
        setStatus('idle');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setStatus('paused');
    };

    recognition.onend = () => {
      if (status === 'listening' && !resultHandled.current) {
         // This is a timeout or no-speech event. Retry the current field.
         processField();
      }
    };

    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [recognition, status, currentFieldIndex, fields, onUpdate, onComplete, processField]);

  useEffect(() => {
    // This effect triggers the processing of the next field whenever the index changes and we are in a running state.
    if (status === 'speaking' || status === 'listening') {
      processField();
    }
  }, [currentFieldIndex, processField]);


  const handleStart = () => {
    window.speechSynthesis.cancel();
    setCurrentFieldIndex(0);
    processField();
  };

  const handlePause = () => {
    if (status === 'listening') {
      recognition.stop();
    }
    if (status === 'speaking') {
      window.speechSynthesis.cancel();
    }
    setStatus('paused');
  };

  const handleResume = () => {
    processField();
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6">Guided Voice Input</Typography>
      {status === 'idle' && <Button onClick={handleStart} startIcon={<MicIcon />}>Start</Button>}
      {(status === 'speaking' || status === 'listening') && <Button onClick={handlePause} startIcon={<PauseIcon />}>Pause</Button>}
      {status === 'paused' && <Button onClick={handleResume} startIcon={<PlayArrowIcon />}>Resume</Button>}

      <Typography variant="body2" sx={{ mt: 1 }}>
        Status: {status}
      </Typography>
      { (status === 'speaking' || status === 'listening') && fields[currentFieldIndex] &&
        <Typography variant="body2">
          Current Field: {fields[currentFieldIndex].label}
        </Typography>
      }
    </Box>
  );
};

export default GuidedVoiceAdd;
