import os
import torch
import boto3
import openai
import websockets
import stomper
import asyncio
import json
from joblib import load
import app.utils.global_vars
from app.utils.converter import datetime_to_json_formatting
from app.services.diary.diary_socket import make_image
from dotenv import load_dotenv
from diffusers import DPMSolverMultistepScheduler, StableDiffusionXLPipeline
from diffusers.models import AutoencoderKL


def load_sdxl():
    print("=================== Checkpoint loaded start ===================")
    base_dir = app.utils.global_vars.base_dir
    base = StableDiffusionXLPipeline.from_single_file(base_dir + "checkpoint/stable-diffusion-xl-base-1.0.safetensors", torch_dtype=torch.float16, variant="fp16")
    base.to("cuda")
    base.scheduler = DPMSolverMultistepScheduler.from_config(base.scheduler.config, use_karras_sigmas="true", algorithm_type="sde-dpmsolver++")
    print("=================== Checkpoint loaded end ===================")
    
    print("=================== lora loaded start ===================")
    base.load_lora_weights(base_dir + "lora/detail.safetensors", adapter_name="detail")
    base.load_lora_weights(base_dir + "lora/children.safetensors", adapter_name="child")
    base.load_lora_weights(base_dir + "lora/animation.safetensors", adapter_name="animate")
    base.load_lora_weights(base_dir + "lora/pixel.safetensors", adapter_name="pixel")
    print("=================== lora loaded end ===================")
    # 생성 model 글로벌 변수에 주입
    app.utils.global_vars.base = base

def load_env():
    print("=================== env loaded start ===================")
    load_dotenv()
    print("=================== env loaded end ===================")

def load_emotion():
    print("=================== emotion loaded start ===================")
    base_dir = app.utils.global_vars.base_dir
    # CountVectorizer 객체 로드
    app.utils.global_vars.cv_loaded = load(base_dir + 'model/emotion/count_vectorizer_v2.joblib')
    # MultinomialNB 객체 로드
    app.utils.global_vars.clf_loaded = load(base_dir + 'model/emotion/emotion_classifier_model_v2.joblib')
    print("=================== emotion loaded end ===================")

def load_mbti():
    print("=================== mbti loaded start ===================")
    base_dir = app.utils.global_vars.base_dir
    # MBTI 모델 로드
    app.utils.global_vars.mbti = load(base_dir + 'model/mbti/mbti_model')
    print("=================== mbti loaded end ===================")

async def connect_socket():
    ws_url = f"wss://dangil.store/api/ws"
    print("=================== ws connect start ===================")
    async with websockets.connect(ws_url) as websocket:
        await websocket.send("CONNECT\naccept-version:1.0,1.1,2.0\n\n\x00\n")

        sub_offer = stomper.subscribe("/sub/fastapi", idx="fastapi", ack="auto")
        await websocket.send(sub_offer)

        while True:
            try:
                # Recv Listen
                message = await websocket.recv()
                # Get current event_loop
                loop = asyncio.get_event_loop()
                # Response Split
                msg_type = message.split("\n")
                # Destination /sub/fatapi 체크 
                if "/sub/fastapi" in msg_type[1]:
                    # Dict to JSON
                    # Execute AI Flow
                    result = await loop.run_in_executor(None, lambda: make_image(json.loads(msg_type[7].replace("\x00", ""))))
                    result = json.dumps(result, default=datetime_to_json_formatting)
                    send = stomper.send("/pub/diary/created", result, None, "application/json")
                    await websocket.send(send)
            except websockets.ConnectionClosed as e:
                print(f"WebSocket Disconnected", e)
                break
        
    print("=================== ws connect end ===================")

def connect_openai():
    print("=================== opanai connect start ===================")
    openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    app.utils.global_vars.openai_client = openai_client
    print("=================== opanai connect end ===================")

def connect_s3():
    print("=================== S3 connect start ===================")
    s3 = boto3.client(
        "s3",
        aws_access_key_id=os.getenv("AWS_S3_ACCESS_KEY"),
        aws_secret_access_key=os.getenv("AWS_S3_PRIVATE_KEY")
    )
    app.utils.global_vars.s3 = s3
    print("=================== S3 connect start ===================")
