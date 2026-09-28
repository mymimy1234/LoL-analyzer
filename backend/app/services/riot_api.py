import os

import requests
from dotenv import load_dotenv

load_dotenv()

RIOT_API_KEY = os.getenv("RIOT_API_KEY")

if not RIOT_API_KEY:
    raise RuntimeError("RIOT_API_KEY가 없습니다.")

HEADERS = {
    "X-Riot-Token": RIOT_API_KEY,
    "Accept": "application/json",
}


def riot_request(url: str, params=None):
    response = requests.get(
        url,
        headers=HEADERS,
        params=params,
        timeout=30,
    )

    if response.status_code != 200:
        raise Exception(
            f"Riot API 오류: {response.status_code} {response.text}"
        )

    return response.json()


def get_account_by_riot_id(game_name: str, tag_line: str):
    url = (
        "https://asia.api.riotgames.com/"
        "riot/account/v1/accounts/by-riot-id/"
        f"{game_name}/{tag_line}"
    )

    return riot_request(url)


def get_match_ids(puuid: str, count: int = 20):
    url = (
        "https://asia.api.riotgames.com/"
        "lol/match/v5/matches/by-puuid/"
        f"{puuid}/ids"
    )

    return riot_request(
        url,
        params={"count": count},
    )


def get_match(match_id: str):
    url = (
        "https://asia.api.riotgames.com/"
        f"lol/match/v5/matches/{match_id}"
    )

    return riot_request(url)

def get_match_timeline(match_id: str):
    url = (
        "https://asia.api.riotgames.com/"
        f"lol/match/v5/matches/{match_id}/timeline"
    )

    return riot_request(url)