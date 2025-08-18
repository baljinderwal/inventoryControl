import React, { useState, useEffect, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { Tooltip } from '@mui/material';

const VoiceRecognition = ({ onResult, onStateChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

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

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
    if (onStateChange) {
      onStateChange('idle');
    }
  }, [recognition, onStateChange]);

  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      stopListening();
    };

    const handleError = (event) => {
      console.error('Speech recognition error', event.error);
      stopListening();
    };

    const handleEnd = () => {
      if (isListening) {
        stopListening();
      }
    };

    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = handleEnd;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [recognition, isListening, onResult, stopListening]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      if (onStateChange) {
        onStateChange('listening');
      }
      recognition.start();
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!recognition) {
    return (
      <Tooltip title="Voice recognition not supported in this browser">
        <span>
          <IconButton disabled>
            <MicOffIcon />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={isListening ? 'Stop listening' : 'Start listening'}>
      <IconButton onClick={handleMicClick} color={isListening ? 'secondary' : 'default'}>
        {isListening ? <MicOffIcon /> : <MicIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default VoiceRecognition;
