import React, { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import MicIcon from '@mui/icons-material/Mic';

const SmartVoiceAdd = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
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
  }, [recognition]);

  const parseTranscript = useCallback((transcript) => {
    const data = {};

    const patterns = [
        { key: 'name', regex: /\b(?:product name is|name is|called)\s+(.*?)(?=\s*,\s*\b(?:sku|barcode|category|price|cost price|low stock threshold|image url|initial stock|batch number|expiry date)\b|$)/i },
        { key: 'sku', regex: /\b(?:sku is|sku)\s+(.*?)(?=\s*,\s*\b(?:barcode|category|price|cost price|low stock threshold|image url|initial stock|batch number|expiry date)\b|$)/i },
        { key: 'barcode', regex: /\b(?:barcode is|barcode)\s+(.*?)(?=\s*,\s*\b(?:category|price|cost price|low stock threshold|image url|initial stock|batch number|expiry date)\b|$)/i },
        { key: 'category', regex: /\b(?:category is|category)\s+(.*?)(?=\s*,\s*\b(?:price|cost price|low stock threshold|image url|initial stock|batch number|expiry date)\b|$)/i },
        { key: 'costPrice', regex: /\bcost\s+price\s+is\s+([\d.]+)/i },
        { key: 'price', regex: /\bprice\s+is\s+([\d.]+)/i },
        { key: 'lowStockThreshold', regex: /\blow\s+stock\s+threshold\s+is\s+(\d+)/i },
        { key: 'imageUrl', regex: /\bimage\s+url\s+is\s+(\S+)/i },
        { key: 'stock', regex: /\b(?:stock is|stock|initial stock is|initial stock)\s+(\d+)/i },
        { key: 'batchNumber', regex: /\bbatch\s+number\s+is\s+(.*?)(?=\s*,|\s*$)/i },
    ];

    patterns.forEach(pattern => {
        const match = transcript.match(pattern.regex);
        if (match && match[1]) {
            let value = match[1].trim();
            if (value.endsWith(',')) {
                value = value.slice(0, -1);
            }
            data[pattern.key] = value.trim();
        }
    });

    onResult(data);
  }, [onResult]);

  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      parseTranscript(transcript);
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
  }, [recognition, isListening, onResult, stopListening, parseTranscript]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
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
    return null;
  }

  return (
    <>
      <Button
        variant="contained"
        color={isListening ? 'secondary' : 'primary'}
        onClick={handleMicClick}
        startIcon={<MicIcon />}
      >
        {isListening ? 'Stop Listening' : 'Add Product by Voice'}
      </Button>
    </>
  );
};

export default SmartVoiceAdd;
