def safe_number(value, default=0):
    if value is None:
        return default

    return value


def analyze_combat(player: dict) -> dict:
    """
    전투 관련 지표 분석
    """

    kills = safe_number(
        player.get("kills")
    )

    deaths = safe_number(
        player.get("deaths")
    )

    assists = safe_number(
        player.get("assists")
    )

    kill_participation = safe_number(
        player.get("kill_participation")
    )

    damage = player.get(
        "damage",
        {}
    )

    damage_dealt = safe_number(
        damage.get("champions")
    )

    damage_taken = safe_number(
        damage.get("taken")
    )

    result = {
        "kill_participation": kill_participation,
        "damage_dealt": damage_dealt,
        "damage_taken": damage_taken,
        "kills": kills,
        "deaths": deaths,
        "assists": assists,
        "strengths": [],
        "weaknesses": [],
    }

    if kill_participation >= 70:
        result["strengths"].append(
            "팀 전투에 적극적으로 참여했습니다."
        )

    elif kill_participation < 40:
        result["weaknesses"].append(
            "팀 킬에 대한 참여 비중이 낮았습니다."
        )

    if deaths >= 7:
        result["weaknesses"].append(
            "데스가 많아 안정적인 플레이가 필요했습니다."
        )

    elif deaths <= 2:
        result["strengths"].append(
            "데스를 낮게 유지했습니다."
        )

    if damage_dealt >= 30000:
        result["strengths"].append(
            "챔피언에게 높은 피해량을 기록했습니다."
        )

    return result


def analyze_farming(player: dict) -> dict:
    """
    CS 및 성장 분석
    """

    cs_data = player.get(
        "cs",
        {}
    )

    total_cs = safe_number(
        cs_data.get("total")
    )

    cs_per_min = safe_number(
        cs_data.get("per_minute")
    )

    gold_data = player.get(
        "gold",
        {}
    )

    gold = safe_number(
        gold_data.get("earned")
    )

    result = {
        "cs": total_cs,
        "cs_per_minute": cs_per_min,
        "gold": gold,
        "strengths": [],
        "weaknesses": [],
    }

    if cs_per_min >= 8:
        result["strengths"].append(
            "높은 CS 수급량을 기록했습니다."
        )

    elif cs_per_min < 5:
        result["weaknesses"].append(
            "CS 수급량이 낮았습니다."
        )

    if gold >= 12000:
        result["strengths"].append(
            "높은 골드 획득량을 기록했습니다."
        )

    return result


def analyze_vision(player: dict) -> dict:
    """
    시야 분석
    """

    vision = player.get(
        "vision",
        {}
    )

    score = safe_number(
        vision.get("score")
    )

    wards_placed = safe_number(
        vision.get("wards_placed")
    )

    wards_killed = safe_number(
        vision.get("wards_killed")
    )

    result = {
        "score": score,
        "wards_placed": wards_placed,
        "wards_killed": wards_killed,
        "strengths": [],
        "weaknesses": [],
    }

    if score >= 40:
        result["strengths"].append(
            "높은 시야 점수를 기록했습니다."
        )

    elif score <= 10:
        result["weaknesses"].append(
            "시야 확보가 부족했습니다."
        )

    if wards_killed >= 5:
        result["strengths"].append(
            "적 와드를 적극적으로 제거했습니다."
        )

    return result


def analyze_objectives(timeline: dict) -> dict:
    """
    오브젝트 및 포탑 분석
    """

    dragons = timeline.get(
        "dragons",
        []
    )

    heralds = timeline.get(
        "rift_heralds",
        []
    )

    barons = timeline.get(
        "barons",
        []
    )

    towers = timeline.get(
        "towers",
        []
    )

    solo_kills = safe_number(
        timeline.get("solo_kills")
    )

    solo_deaths = safe_number(
        timeline.get("solo_deaths")
    )

    result = {
        "dragon_count": len(dragons),
        "rift_herald_count": len(heralds),
        "baron_count": len(barons),
        "tower_count": len(towers),
        "solo_kills": solo_kills,
        "solo_deaths": solo_deaths,
        "strengths": [],
        "weaknesses": [],
    }

    if len(dragons) >= 2:
        result["strengths"].append(
            "여러 차례 드래곤 오브젝트에 참여했습니다."
        )

    if len(barons) >= 1:
        result["strengths"].append(
            "바론 오브젝트를 확보한 경기가 있었습니다."
        )

    if len(towers) >= 3:
        result["strengths"].append(
            "포탑 파괴에 적극적으로 기여했습니다."
        )

    if solo_kills >= 2:
        result["strengths"].append(
            "솔로킬을 통해 개인적인 전투 우위를 만들었습니다."
        )

    if solo_deaths >= 2:
        result["weaknesses"].append(
            "솔로데스가 발생해 개인적인 교전 판단을 점검할 필요가 있습니다."
        )

    return result


def analyze_timeline(timeline: dict) -> dict:
    """
    시간대별 라인전 및 성장 분석
    """

    lane = timeline.get(
        "lane_comparison"
    )

    result = {
        "lane": None,
        "growth": None,
        "first_blood": timeline.get(
            "first_blood"
        ),
        "solo_kills": timeline.get(
            "solo_kills",
            0,
        ),
        "solo_deaths": timeline.get(
            "solo_deaths",
            0,
        ),
    }

    if not lane:
        return result

    ten = lane.get(
        "10_minutes",
        {}
    )

    fifteen = lane.get(
        "15_minutes",
        {}
    )

    ten_cs = safe_number(
        ten.get("cs_difference")
    )

    ten_gold = safe_number(
        ten.get("gold_difference")
    )

    fifteen_cs = safe_number(
        fifteen.get("cs_difference")
    )

    fifteen_gold = safe_number(
        fifteen.get("gold_difference")
    )

    result["lane"] = {
        "10_minutes": {
            "cs_difference": ten_cs,
            "gold_difference": ten_gold,
        },

        "15_minutes": {
            "cs_difference": fifteen_cs,
            "gold_difference": fifteen_gold,
        },
    }

    result["growth"] = {
        "cs_difference_change": (
            fifteen_cs - ten_cs
        ),

        "gold_difference_change": (
            fifteen_gold - ten_gold
        ),
    }

    return result


def create_summary(
    match: dict,
    combat: dict,
    farming: dict,
    vision: dict,
    objectives: dict,
    timeline: dict,
) -> dict:
    """
    전체 경기 요약 생성
    """

    strengths = []
    weaknesses = []

    strengths.extend(
        combat["strengths"]
    )

    strengths.extend(
        farming["strengths"]
    )

    strengths.extend(
        vision["strengths"]
    )

    strengths.extend(
        objectives["strengths"]
    )

    weaknesses.extend(
        combat["weaknesses"]
    )

    weaknesses.extend(
        farming["weaknesses"]
    )

    weaknesses.extend(
        vision["weaknesses"]
    )

    weaknesses.extend(
        objectives["weaknesses"]
    )

    # -----------------------------
    # 라인전 분석 추가
    # -----------------------------

    lane = timeline.get(
        "lane"
    )

    if lane:

        cs_10 = lane[
            "10_minutes"
        ][
            "cs_difference"
        ]

        gold_10 = lane[
            "10_minutes"
        ][
            "gold_difference"
        ]

        cs_15 = lane[
            "15_minutes"
        ][
            "cs_difference"
        ]

        gold_15 = lane[
            "15_minutes"
        ][
            "gold_difference"
        ]

        if cs_10 >= 10:
            strengths.append(
                f"10분 기준 상대보다 CS를 {cs_10}개 앞섰습니다."
            )

        elif cs_10 <= -10:
            weaknesses.append(
                f"10분 기준 상대보다 CS가 {abs(cs_10)}개 부족했습니다."
            )

        if gold_10 >= 500:
            strengths.append(
                f"10분 기준 상대보다 골드가 {gold_10} 앞섰습니다."
            )

        elif gold_10 <= -500:
            weaknesses.append(
                f"10분 기준 상대보다 골드가 {abs(gold_10)} 부족했습니다."
            )

        if cs_15 >= 15:
            strengths.append(
                f"15분까지 CS 격차를 {cs_15}개까지 벌렸습니다."
            )

        elif cs_15 <= -15:
            weaknesses.append(
                f"15분까지 CS가 상대보다 {abs(cs_15)}개 부족했습니다."
            )

        if gold_15 >= 1000:
            strengths.append(
                f"15분 기준 상대보다 골드가 {gold_15} 앞섰습니다."
            )

        elif gold_15 <= -1000:
            weaknesses.append(
                f"15분 기준 상대보다 골드가 {abs(gold_15)} 부족했습니다."
            )

    win = match["game"]["win"]

    if win:
        result = "WIN"

    else:
        result = "LOSS"

    return {
        "result": result,
        "strengths": strengths,
        "weaknesses": weaknesses,
    }


def analyze_match(
    match_result: dict,
    timeline_result: dict,
) -> dict:
    """
    Match + Timeline 데이터를 받아
    최종 경기 분석 결과를 생성한다.
    """

    player = match_result["player"]

    combat = analyze_combat(
        player
    )

    farming = analyze_farming(
        player
    )

    vision = analyze_vision(
        player
    )

    objectives = analyze_objectives(
        timeline_result
    )

    timeline = analyze_timeline(
        timeline_result
    )

    summary = create_summary(
        match_result,
        combat,
        farming,
        vision,
        objectives,
        timeline,
    )

    return {
        "summary": summary,
        "combat": combat,
        "farming": farming,
        "vision": vision,
        "objectives": objectives,
        "timeline": timeline,
    }


def analyze_recent_matches(
    matches: list[dict],
) -> dict:
    """
    최근 경기 전체 통계 분석
    """

    if not matches:
        return {
            "total_games": 0,
            "wins": 0,
            "losses": 0,
            "win_rate": 0,
            "average_kda": 0,
            "average_cs_per_minute": 0,
            "average_damage": 0,
            "average_gold": 0,
            "champions": [],
            "positions": [],
        }

    total_games = len(matches)

    wins = sum(
        1
        for match in matches
        if match.get("win")
    )

    losses = total_games - wins

    def average(key):
        values = [
            float(
                match.get(key) or 0
            )
            for match in matches
        ]

        if not values:
            return 0

        return round(
            sum(values) / len(values),
            2,
        )

    # -----------------------------
    # 챔피언별 통계
    # -----------------------------

    champion_stats = {}

    for match in matches:

        champion = (
            match.get("champion")
            or "Unknown"
        )

        if champion not in champion_stats:
            champion_stats[champion] = {
                "champion": champion,
                "games": 0,
                "wins": 0,
                "losses": 0,
            }

        champion_stats[
            champion
        ]["games"] += 1

        if match.get("win"):
            champion_stats[
                champion
            ]["wins"] += 1

        else:
            champion_stats[
                champion
            ]["losses"] += 1

    champions = []

    for data in champion_stats.values():

        games = data["games"]

        champions.append({
            **data,
            "win_rate": round(
                data["wins"] / games * 100,
                1,
            ),
        })

    champions.sort(
        key=lambda x: x["games"],
        reverse=True,
    )

    # -----------------------------
    # 포지션별 통계
    # -----------------------------

    position_stats = {}

    for match in matches:

        position = (
            match.get("position")
            or "UNKNOWN"
        )

        if position not in position_stats:
            position_stats[position] = {
                "position": position,
                "games": 0,
                "wins": 0,
                "losses": 0,
            }

        position_stats[
            position
        ]["games"] += 1

        if match.get("win"):
            position_stats[
                position
            ]["wins"] += 1

        else:
            position_stats[
                position
            ]["losses"] += 1

    positions = []

    for data in position_stats.values():

        games = data["games"]

        positions.append({
            **data,
            "win_rate": round(
                data["wins"] / games * 100,
                1,
            ),
        })

    positions.sort(
        key=lambda x: x["games"],
        reverse=True,
    )

    # -----------------------------
    # 최종 결과
    # -----------------------------

    return {
        "total_games": total_games,

        "wins": wins,

        "losses": losses,

        "win_rate": round(
            wins / total_games * 100,
            1,
        ),

        "average_kda": average(
            "kda"
        ),

        "average_cs_per_minute": average(
            "cs_per_minute"
        ),

        "average_damage": round(
            average("damage")
        ),

        "average_gold": round(
            average("gold")
        ),

        "champions": champions,

        "positions": positions,
    }