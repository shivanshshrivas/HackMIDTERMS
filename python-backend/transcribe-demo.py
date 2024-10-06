from flask import Flask, jsonify
from flask_cors import CORS
import threading
import numpy as np
import speech_recognition as sr
import whisper
import torch
from queue import Queue
from time import sleep

app = Flask(__name__)
CORS(app)

data_queue = Queue()
transcriptions = []
lock = threading.Lock()

def capture_audio():
    recorder = sr.Recognizer()
    recorder.energy_threshold = 1000
    recorder.dynamic_energy_threshold = False

    model = whisper.load_model('small.en')

    selected_source = None
    for index, name in enumerate(sr.Microphone.list_microphone_names()):
        if 'stereo_mix' in name.lower():
            selected_source = sr.Microphone(device_index=index, sample_rate=16000)
            print(f"Selected source: {name}")
            break
    
    if selected_source is None:
        print("No stereo mix found")
        return
    
    with selected_source as source:
        recorder.adjust_for_ambient_noise(source)
    
    def record_callback(_, audio: sr.AudioData):
        data = audio.get_raw_data()
        data_queue.put(data)
    
    recorder.listen_in_background(selected_source, record_callback, phrase_time_limit=2)

    while True:
        if not data_queue.empty():
            audio_data = b''.join(data_queue.queue)
            data_queue.queue.clear()

            audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0
            result = model.transcribe(audio_np, fp16=torch.cuda.is_available())
            text = result['text'].strip()

            with lock:
                transcriptions.append(text)
        sleep(0.25)

@app.route('/transcriptions', methods=['GET'])
def get_transcriptions():
    with lock:
        return jsonify({"transcriptions": transcriptions[-5:]})
    
if __name__ == '__main__':
    threading.Thread(target=capture_audio, daemon=True).start()
    app.run(debug=True, host='0.0.0.0', port=5000)