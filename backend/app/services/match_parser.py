def get_player(match_data: dict, puuid: str) -> dict:
    for participant in match_data["info"]["participants"]:
        if participant["puuid"] == puuid:
            return participant

    raise Exception("해당 플레이어를 찾을 수 없습니다.")


def get_participant_id(
    timeline_data: dict,
    puuid: str,
) -> int | None:

    for participant in timeline_data["info"]["participants"]:
        if participant.get("puuid") == puuid:
            return participant.get("participantId")

    return None


def get_timestamp(timestamp: int) -> float:
    return round(timestamp / 60000, 2)


def calculate_kill_participation(
    player: dict,
    participants: list[dict],
) -> float:

    team_id = player["teamId"]

    team_kills = sum(
        participant["kills"]
        for participant in participants
        if participant["teamId"] == team_id
    )

    if team_kills == 0:
        return 0.0

    return round(
        (player["kills"] + player["assists"])
        / team_kills
        * 100,
        1,
    )


# ==========================================
# 상대 라이너 찾기
# ==========================================

def find_opponent(
    match_data: dict,
    player: dict,
) -> dict | None:

    player_position = player.get(
        "teamPosition",
        "",
    )

    if not player_position:
        return None

    for participant in match_data["info"]["participants"]:

        # 자기 자신 제외
        if participant["puuid"] == player["puuid"]:
            continue

        # 상대팀만
        if participant["teamId"] == player["teamId"]:
            continue

        # 같은 포지션
        if participant.get("teamPosition", "") == player_position:
            return participant

    return None


# ==========================================
# 기본 경기 분석
# ==========================================

def parse_match(
    match_data: dict,
    puuid: str,
) -> dict:

    info = match_data["info"]
    metadata = match_data["metadata"]

    participants = info["participants"]

    player = get_player(
        match_data,
        puuid,
    )

    opponent = find_opponent(
        match_data,
        player,
    )

    duration_seconds = info["gameDuration"]
    duration_minutes = duration_seconds / 60

    lane_cs = player.get(
        "totalMinionsKilled",
        0,
    )

    jungle_cs = player.get(
        "neutralMinionsKilled",
        0,
    )

    total_cs = lane_cs + jungle_cs

    cs_per_min = 0.0

    if duration_minutes > 0:
        cs_per_min = round(
            total_cs / duration_minutes,
            1,
        )

    kills = player["kills"]
    deaths = player["deaths"]
    assists = player["assists"]

    if deaths == 0:
        kda = "Perfect"
    else:
        kda = round(
            (kills + assists) / deaths,
            2,
        )

    kill_participation = calculate_kill_participation(
        player,
        participants,
    )

    return {
        "match_id": metadata["matchId"],

        "game": {
            "duration_seconds": duration_seconds,
            "duration_minutes": round(
                duration_minutes,
                1,
            ),
            "game_mode": info["gameMode"],
            "game_type": info["gameType"],
            "queue_id": info["queueId"],
            "game_version": info["gameVersion"],
            "win": player["win"],
        },

        "player": {
            "puuid": player["puuid"],
            "summoner_name": player.get(
                "summonerName"
            ),

            "champion": player["championName"],
            "champion_level": player["champLevel"],
            "position": player.get(
                "teamPosition",
                "",
            ),

            "team_id": player["teamId"],

            "kills": kills,
            "deaths": deaths,
            "assists": assists,

            "kda": kda,
            "kill_participation": kill_participation,

            "cs": {
                "lane_cs": lane_cs,
                "jungle_cs": jungle_cs,
                "total": total_cs,
                "per_minute": cs_per_min,
            },

            "gold": {
                "earned": player["goldEarned"],
                "spent": player["goldSpent"],
            },

            "damage": {
                "champions": player[
                    "totalDamageDealtToChampions"
                ],
                "taken": player[
                    "totalDamageTaken"
                ],
                "turrets": player[
                    "damageDealtToTurrets"
                ],
            },

            "vision": {
                "score": player[
                    "visionScore"
                ],
                "wards_placed": player[
                    "wardsPlaced"
                ],
                "wards_killed": player[
                    "wardsKilled"
                ],
            },

            "kills_special": {
                "double": player[
                    "doubleKills"
                ],
                "triple": player[
                    "tripleKills"
                ],
                "quadra": player[
                    "quadraKills"
                ],
                "penta": player[
                    "pentaKills"
                ],
            },

            "objectives": {
                "first_blood": player[
                    "firstBloodKill"
                ],
                "first_turret": player[
                    "firstTowerKill"
                ],
            },
        },

        "participants": [
            {
                "is_player": participant.get("puuid") == puuid,
                "summoner_name": participant.get("riotIdGameName")
                or participant.get("summonerName"),
                "champion": participant.get("championName"),
                "champion_level": participant.get("champLevel", 0),
                "position": participant.get("teamPosition", ""),
                "team_id": participant.get("teamId"),
                "win": participant.get("win", False),
                "kills": participant.get("kills", 0),
                "deaths": participant.get("deaths", 0),
                "assists": participant.get("assists", 0),
                "cs": participant.get("totalMinionsKilled", 0)
                + participant.get("neutralMinionsKilled", 0),
                "gold": participant.get("goldEarned", 0),
                "damage": participant.get("totalDamageDealtToChampions", 0),
                "damage_taken": participant.get("totalDamageTaken", 0),
                "vision": participant.get("visionScore", 0),
                "wards_placed": participant.get("wardsPlaced", 0),
                "wards_killed": participant.get("wardsKilled", 0),
                "spell1_id": participant.get("summoner1Id", 0),
                "spell2_id": participant.get("summoner2Id", 0),
                "items": [participant.get(f"item{index}", 0) for index in range(7)],
            }
            for participant in participants
        ],

        # 상대 라이너
        "opponent": (
            {
                "puuid": opponent["puuid"],
                "summoner_name": opponent.get(
                    "summonerName"
                ),
                "champion": opponent[
                    "championName"
                ],
                "position": opponent.get(
                    "teamPosition",
                    "",
                ),
                "team_id": opponent[
                    "teamId"
                ],
            }
            if opponent
            else None
        ),
    }


# ==========================================
# Timeline 분석
# ==========================================

def parse_timeline(
    timeline_data: dict,
    puuid: str,
) -> dict:

    participant_id = get_participant_id(
        timeline_data,
        puuid,
    )

    if participant_id is None:
        raise Exception(
            "Timeline에서 플레이어를 찾을 수 없습니다."
        )

    frames = timeline_data["info"]["frames"]

    events = []

    for frame in frames:
        for event in frame.get(
            "events",
            [],
        ):
            events.append(event)

    result = {
        "first_blood": None,

        "solo_kills": 0,
        "solo_deaths": 0,

        "dragons": [],
        "rift_heralds": [],
        "barons": [],

        "towers": [],

        "cs_at": {},
        "gold_at": {},

        "opponent_cs_at": {},
        "opponent_gold_at": {},

        # =============================
        # 아이템
        # =============================

        "items": [],

        "first_item": None,
    }

    # ======================================
    # 이벤트
    # ======================================

    for event in events:

        event_type = event.get(
            "type"
        )

        timestamp = event.get(
            "timestamp",
            0,
        )

        # -----------------------------
        # 챔피언 킬
        # -----------------------------

        if event_type == "CHAMPION_KILL":

            killer_id = event.get(
                "killerId"
            )

            victim_id = event.get(
                "victimId"
            )

            assists = event.get(
                "assistingParticipantIds",
                [],
            )

            if result["first_blood"] is None:

                result["first_blood"] = {
                    "time": get_timestamp(
                        timestamp
                    ),
                    "killer": killer_id,
                    "victim": victim_id,
                }

            if (
                killer_id == participant_id
                and len(assists) == 0
            ):
                result["solo_kills"] += 1

            if (
                victim_id == participant_id
                and len(assists) == 0
            ):
                result["solo_deaths"] += 1

        # -----------------------------
        # 용 / 전령 / 바론
        # -----------------------------

        elif event_type == "ELITE_MONSTER_KILL":

            monster_type = event.get(
                "monsterType"
            )

            monster_subtype = event.get(
                "monsterSubType"
            )

            data = {
                "time": get_timestamp(
                    timestamp
                ),
                "monster_type": monster_type,
                "monster_subtype": monster_subtype,
                "killer": event.get(
                    "killerId"
                ),
            }

            if monster_type == "DRAGON":

                result["dragons"].append(
                    data
                )

            elif monster_type == "RIFTHERALD":

                result["rift_heralds"].append(
                    data
                )

            elif monster_type == "BARON_NASHOR":

                result["barons"].append(
                    data
                )

        # -----------------------------
        # 포탑
        # -----------------------------

        elif event_type == "BUILDING_KILL":

            if event.get(
                "buildingType"
            ) == "TOWER_BUILDING":

                result["towers"].append(
                    {
                        "time": get_timestamp(
                            timestamp
                        ),
                        "killer": event.get(
                            "killerId"
                        ),
                        "lane": event.get(
                            "laneType"
                        ),
                        "tower": event.get(
                            "towerType"
                        ),
                    }
                )

        # -----------------------------
        # 아이템 구매
        # -----------------------------

        elif event_type == "ITEM_PURCHASED":

            event_participant_id = event.get(
                "participantId"
            )

            # 내가 구매한 아이템만 기록
            if (
                event_participant_id
                == participant_id
            ):

                item_data = {
                    "item_id": event.get(
                        "itemId"
                    ),
                    "time": get_timestamp(
                        timestamp
                    ),
                    "timestamp": timestamp,
                }

                result["items"].append(
                    item_data
                )

                # 첫 구매 아이템
                if result["first_item"] is None:

                    result["first_item"] = item_data

    # ======================================
    # 아이템 구매 시간순 정렬
    # ======================================

    result["items"].sort(
        key=lambda item:
            item["timestamp"]
    )

    return result

# ==========================================
# 상대 라이너 Timeline 비교
# ==========================================

def add_lane_comparison(
    timeline_result,
    timeline_data,
    player_id,
    opponent_id,
):
    """
    플레이어와 상대 라이너의
    10분 / 15분 CS, 골드 차이를 계산한다.
    """

    if player_id is None or opponent_id is None:
        timeline_result["lane_comparison"] = None
        return timeline_result

    frames = timeline_data.get("info", {}).get("frames", [])

    player_stats = {}
    opponent_stats = {}

    for frame in frames:
        timestamp = frame.get("timestamp", 0)

        minute = timestamp // 60000

        participant_frames = frame.get(
            "participantFrames",
            {}
        )

        player_frame = participant_frames.get(
            str(player_id)
        )

        opponent_frame = participant_frames.get(
            str(opponent_id)
        )

        if player_frame:
            player_stats[minute] = {
                "cs": (
                    player_frame.get("minionsKilled", 0)
                    + player_frame.get("jungleMinionsKilled", 0)
                ),
                "gold": player_frame.get(
                    "totalGold",
                    0
                ),
            }

        if opponent_frame:
            opponent_stats[minute] = {
                "cs": (
                    opponent_frame.get("minionsKilled", 0)
                    + opponent_frame.get("jungleMinionsKilled", 0)
                ),
                "gold": opponent_frame.get(
                    "totalGold",
                    0
                ),
            }

    def get_closest(stats, target_minute):
        """
        목표 시간과 가장 가까운 프레임을 찾는다.
        정확한 분 프레임이 없으면
        해당 시간 이전의 가장 최근 프레임을 사용한다.
        """

        if not stats:
            return {
                "cs": 0,
                "gold": 0,
            }

        if target_minute in stats:
            return stats[target_minute]

        previous = [
            minute
            for minute in stats
            if minute <= target_minute
        ]

        if previous:
            closest = max(previous)
            return stats[closest]

        closest = min(
            stats,
            key=lambda x: abs(
                x - target_minute
            ),
        )

        return stats[closest]

    player_10 = get_closest(
        player_stats,
        10,
    )

    opponent_10 = get_closest(
        opponent_stats,
        10,
    )

    player_15 = get_closest(
        player_stats,
        15,
    )

    opponent_15 = get_closest(
        opponent_stats,
        15,
    )

    timeline_result["lane_comparison"] = {
        "10_minutes": {
            "player": player_10,
            "opponent": opponent_10,

            "cs_difference": (
                player_10["cs"]
                - opponent_10["cs"]
            ),

            "gold_difference": (
                player_10["gold"]
                - opponent_10["gold"]
            ),
        },

        "15_minutes": {
            "player": player_15,
            "opponent": opponent_15,

            "cs_difference": (
                player_15["cs"]
                - opponent_15["cs"]
            ),

            "gold_difference": (
                player_15["gold"]
                - opponent_15["gold"]
            ),
        },
    }

    return timeline_result

def parse_timeline_details(
    timeline_data: dict,
    puuid: str,
) -> dict:
    """
    Timeline에서 세부 이벤트를 추출한다.
    """

    info = timeline_data.get(
        "info",
        {}
    )

    frames = info.get(
        "frames",
        []
    )

    participant_id = get_participant_id(
        timeline_data,
        puuid,
    )

    result = {
        "first_item_purchase": None,
        "dragon_details": [],
        "rift_herald_details": [],
        "baron_details": [],
        "turret_details": [],
        "turret_plates": [],
    }

    if participant_id is None:
        return result

    # -----------------------------
    # 모든 이벤트 순회
    # -----------------------------

    for frame in frames:

        events = frame.get(
            "events",
            []
        )

        for event in events:

            event_type = event.get(
                "type"
            )

            timestamp = event.get(
                "timestamp",
                0
            )

            minute = round(
                timestamp / 60000,
                2
            )

            # -------------------------
            # 첫 아이템 구매
            # -------------------------

            if event_type == "ITEM_PURCHASED":

                event_participant = event.get(
                    "participantId"
                )

                if (
                    event_participant == participant_id
                    and result["first_item_purchase"] is None
                ):
                    result["first_item_purchase"] = {
                        "timestamp": timestamp,
                        "minute": minute,
                        "item_id": event.get(
                            "itemId"
                        ),
                    }

            # -------------------------
            # 드래곤
            # -------------------------

            elif event_type == "ELITE_MONSTER_KILL":

                monster_type = event.get(
                    "monsterType"
                )

                monster_subtype = event.get(
                    "monsterSubType"
                )

                killer_id = event.get(
                    "killerId"
                )

                if monster_type == "DRAGON":

                    result["dragon_details"].append({
                        "timestamp": timestamp,
                        "minute": minute,
                        "dragon_type": monster_subtype,
                        "killer_id": killer_id,
                        "my_team": (
                            killer_id == participant_id
                        ),
                    })

                # -------------------------
                # 전령
                # -------------------------

                elif monster_type == "RIFTHERALD":

                    result["rift_herald_details"].append({
                        "timestamp": timestamp,
                        "minute": minute,
                        "killer_id": killer_id,
                        "my_team": (
                            killer_id == participant_id
                        ),
                    })

                # -------------------------
                # 바론
                # -------------------------

                elif monster_type == "BARON_NASHOR":

                    result["baron_details"].append({
                        "timestamp": timestamp,
                        "minute": minute,
                        "killer_id": killer_id,
                        "my_team": (
                            killer_id == participant_id
                        ),
                    })

            # -------------------------
            # 건물 파괴
            # -------------------------

            elif event_type == "BUILDING_KILL":

                building_type = event.get(
                    "buildingType"
                )

                killer_id = event.get(
                    "killerId"
                )

                assisting_participants = event.get(
                    "assistingParticipantIds",
                    []
                )

                participated = (
                    killer_id == participant_id
                    or participant_id
                    in assisting_participants
                )

                if building_type == "TOWER_BUILDING":

                    result["turret_details"].append({
                        "timestamp": timestamp,
                        "minute": minute,
                        "lane": event.get(
                            "laneType"
                        ),
                        "tower_type": event.get(
                            "towerType"
                        ),
                        "killer_id": killer_id,
                        "participated": participated,
                        "first": event.get(
                            "first"
                        ),
                    })

            # -------------------------
            # 포탑 방패
            # -------------------------

            elif event_type == "TURRET_PLATE_DESTROYED":

                killer_id = event.get(
                    "killerId"
                )

                if killer_id == participant_id:
                    result["turret_plates"].append({
                        "timestamp": timestamp,
                        "minute": minute,
                        "lane": event.get(
                            "laneType"
                        ),
                    })

    return result