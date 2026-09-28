import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def generate_ai_analysis(
    match_data: dict,
    analysis_data: dict,
) -> str:

    player = match_data["player"]
    game = match_data["game"]

    prompt = f"""
너는 League of Legends 경기 분석 코치다.

아래 데이터를 바탕으로 플레이어의 경기를 분석해라.

[경기]
승리 여부: {game["win"]}
게임 시간: {game["duration_minutes"]}분
챔피언: {player["champion"]}
포지션: {player["position"]}

[KDA]
킬: {player["kills"]}
데스: {player["deaths"]}
어시스트: {player["assists"]}
KDA: {player["kda"]}

[CS]
CS: {player["cs"]["total"]}
CS/min: {player["cs"]["per_minute"]}

[골드]
획득 골드: {player["gold"]["earned"]}

[피해량]
챔피언 피해량: {player["damage"]["champions"]}
받은 피해량: {player["damage"]["taken"]}

[시야]
시야 점수: {player["vision"]["score"]}

[분석 결과]
{analysis_data}

다음 형식으로 분석해라.

1. 경기 요약
2. 잘한 점
3. 아쉬운 점
4. 라인전 분석
5. 오브젝트 분석
6. 다음 경기에서 개선할 점

근거가 없는 내용은 추측하지 말고,
제공된 데이터에 근거해서 분석해라.

한국어로 답변해라.
"""

    response = client.responses.create(
        model="gpt-5-mini",
        input=prompt,
    )

    return response.output_text