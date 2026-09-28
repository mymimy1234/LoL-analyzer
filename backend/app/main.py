from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.services.riot_api import (
    get_account_by_riot_id,
    get_match_ids,
    get_match,
    get_match_timeline,
)

from app.services.match_parser import (
    parse_match,
    parse_timeline,
    get_participant_id,
    add_lane_comparison,
    parse_timeline_details,
)

from app.services.analyzer import (
    analyze_match,
    analyze_recent_matches,
)


app = FastAPI(
    title="LoL Analyzer"
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# 기본
# =========================

@app.get("/")
def root():
    return {
        "message": "LoL Analyzer API"
    }


# =========================
# Riot ID → Account
# =========================

@app.get("/player/{game_name}/{tag_line}")
def get_player(
    game_name: str,
    tag_line: str,
):
    try:
        account = get_account_by_riot_id(
            game_name,
            tag_line,
        )

        return account

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# =========================
# Match 하나 조회
# =========================

@app.get("/match/{match_id}")
def get_match_data(
    match_id: str,
):
    try:
        return get_match(
            match_id
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# =========================
# Timeline 조회
# =========================

@app.get("/timeline/{match_id}")
def get_timeline(
    match_id: str,
    puuid: str,
):
    try:
        timeline_data = get_match_timeline(
            match_id
        )

        result = parse_timeline(
            timeline_data,
            puuid,
        )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# =========================
# 기본 Match 분석
# =========================

@app.get("/analyze/{match_id}")
def analyze(
    match_id: str,
    puuid: str,
):
    try:
        match_data = get_match(
            match_id
        )

        result = parse_match(
            match_data,
            puuid,
        )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# =========================
# 전체 Match 분석
# =========================

@app.get("/analysis/{match_id}")
def full_analysis(
    match_id: str,
    puuid: str,
):
    try:

        # -------------------------
        # Match
        # -------------------------

        match_data = get_match(
            match_id
        )

        match_result = parse_match(
            match_data,
            puuid,
        )


        # -------------------------
        # Timeline
        # -------------------------

        timeline_data = get_match_timeline(
            match_id
        )

        timeline_result = parse_timeline(
            timeline_data,
            puuid,
        )


        # -------------------------
        # Player ID
        # -------------------------

        player_id = get_participant_id(
            timeline_data,
            puuid,
        )

        if player_id is None:
            raise Exception(
                "Timeline에서 플레이어 ID를 찾을 수 없습니다."
            )


        # -------------------------
        # Opponent ID
        # -------------------------

        opponent = match_result.get(
            "opponent"
        )

        opponent_id = None

        if opponent:

            opponent_id = get_participant_id(
                timeline_data,
                opponent["puuid"],
            )


        # -------------------------
        # Lane Comparison
        # -------------------------

        timeline_result = add_lane_comparison(
            timeline_result,
            timeline_data,
            player_id,
            opponent_id,
        )


        # -------------------------
        # Timeline Details
        # -------------------------

        timeline_details = parse_timeline_details(
            timeline_data,
            puuid,
        )

        timeline_result[
            "details"
        ] = timeline_details


        # -------------------------
        # Analysis
        # -------------------------

        analysis_result = analyze_match(
            match_result,
            timeline_result,
        )


        return {
            "match": match_result,
            "timeline": timeline_result,
            "analysis": analysis_result,
            "ai_analysis": None,
        }


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# =========================
# 최근 경기
# =========================

@app.get("/matches/{game_name}/{tag_line}")
def get_recent_matches(
    game_name: str,
    tag_line: str,
):
    try:

        # -------------------------
        # Riot ID → PUUID
        # -------------------------

        account = get_account_by_riot_id(
            game_name,
            tag_line,
        )

        puuid = account["puuid"]


        # -------------------------
        # Match IDs
        # -------------------------

        match_ids = get_match_ids(
            puuid,
            count=20,
        )


        matches = []


        # -------------------------
        # Match 데이터 수집
        # -------------------------

        for match_id in match_ids:

            try:

                match_data = get_match(
                    match_id
                )

                info = match_data.get(
                    "info",
                    {}
                )

                # 일반 소환사의 협곡만
                if info.get(
                    "gameMode"
                ) != "CLASSIC":
                    continue


                parsed = parse_match(
                    match_data,
                    puuid,
                )


                player = parsed[
                    "player"
                ]


                matches.append({
                    "match_id": match_id,
                    "queue_id": info.get("queueId"),
                    "game_creation": info.get("gameCreation"),
                    "game_version": info.get("gameVersion"),
                    "participants": parsed.get("participants", []),

                    "champion": player.get(
                        "champion"
                    ),

                    "position": player.get(
                        "position"
                    ),

                    "win": parsed["game"]["win"],

                    "kills": player.get(
                        "kills",
                        0,
                    ),

                    "deaths": player.get(
                        "deaths",
                        0,
                    ),

                    "assists": player.get(
                        "assists",
                        0,
                    ),

                    "kda": player.get(
                        "kda",
                        0,
                    ),

                    "cs": player.get(
                        "cs",
                        {}
                    ).get(
                        "total",
                        0,
                    ),

                    "cs_per_minute": player.get(
                        "cs",
                        {}
                    ).get(
                        "per_minute",
                        0,
                    ),

                    "gold": player.get(
                        "gold",
                        {}
                    ).get(
                        "earned",
                        0,
                    ),

                    "damage": player.get(
                        "damage",
                        {}
                    ).get(
                        "champions",
                        0,
                    ),

                    "damage_taken": player.get(
                        "damage",
                        {}
                    ).get(
                        "taken",
                        0,
                    ),

                    "vision_score": player.get(
                        "vision",
                        {}
                    ).get(
                        "score",
                        0,
                    ),

                    "duration": info.get(
                        "gameDuration",
                        0,
                    ) // 60,
                })


            except Exception as e:

                print(
                    f"Match {match_id} 처리 실패: {e}"
                )

                continue


        # -------------------------
        # 최근 경기 통계
        # -------------------------

        statistics = analyze_recent_matches(
            matches
        )


        # -------------------------
        # Response
        # -------------------------

        return {
            "riot_id": (
                f"{game_name}#{tag_line}"
            ),

            "puuid": puuid,

            "total_matches": len(
                matches
            ),

            "matches": matches,

            "statistics": statistics,
        }


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )