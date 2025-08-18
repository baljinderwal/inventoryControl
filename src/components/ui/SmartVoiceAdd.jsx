import React, { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import MicIcon from '@mui/icons-material/Mic';
import nlp from 'compromise';

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
    const doc = nlp(transcript);
    const data = {};

    const name = doc.match('(product name is|name is|called) *').out('text');
    if (name) data.name = name;

    const sku = doc.match('(sku is|SKU) *').out('text');
    if (sku) data.sku = sku;

    const barcode = doc.match('(barcode is|barcode) *').out('text');
    if (barcode) data.barcode = barcode;

    const category = doc.match('(category is|category) *').out('text');
    if (category) data.category = category;

    const price = doc.match('(price is|price) #Money').out('text');
    if (price) data.price = price;

    const costPrice = doc.match('(cost price is|cost price) #Money').out('text');
    if (costPrice) data.costPrice = costPrice;

    const lowStockThreshold = doc.match('(low stock threshold is|low stock threshold) #Value').out('text');
    if (lowStockThreshold) data.lowStockThreshold = lowStockThreshold;

    const imageUrl = doc.match('(image url is|image url) #Url').out('text');
    if (imageUrl) data.imageUrl = imageUrl;

    const stock = doc.match('(stock is|stock|initial stock is|initial stock) #Value').out('text');
    if (stock) data.stock = stock;

    const batchNumber = doc.match('(batch number is|batch number) *').out('text');
    if (batchNumber) data.batchNumber = batchNumber;

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
    <Button
      variant="contained"
      color={isListening ? 'secondary' : 'primary'}
      onClick={handleMicClick}
      startIcon={<MicIcon />}
    >
      {isListening ? 'Stop Listening' : 'Add Product by Voice'}
    </Button>
  );
};

export default SmartVoiceAdd;
